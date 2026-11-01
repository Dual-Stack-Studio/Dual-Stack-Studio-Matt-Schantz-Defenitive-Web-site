// Fills "Site texts and settings" with the words the site shows today, so the dashboard opens with everything in place
// and Matt only has to edit. Fields that already have something are never overwritten, so it is safe to run again.
//   npx sanity exec scripts/seed-site.mjs --with-user-token
// Optional:  SEED_MUSIC=<path to an mp3>  SEED_CTA_DARK=<photo>  SEED_CTA_LIGHT=<photo>
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})
const img = async (file) => ({_type: 'image', asset: {_type: 'reference', _ref: (await client.assets.upload('image', fs.createReadStream(file), {filename: path.basename(file)}))._id}})

const defaults = {
  siteName: 'Matt Schantz',
  pageTitle: 'Matt Schantz',
  pageDescription: 'Photography, video and writing by Matt Schantz: national parks, wildlife and quiet places, photographed and filmed on the way.',
  loadingText: 'Loading the photographs',
  defaultTheme: 'dark',
  hideThemeSwitch: false,
  heroLine1: 'Matt',
  heroLine2: 'Schantz',
  heroImageAlt: 'Matt Schantz',
  navAbout: 'About', navPhotography: 'Photography', navVideos: 'Videos', navWriting: 'Writing', navContact: 'Contact',
  helloLabel: 'Say hello', labelSubjects: 'Subjects', labelPortfolio: 'Portfolio',
  contactTitle: 'Pull over,\nsay hello.',
  contactIntro: 'Questions, a project, or just hello. Write a few lines and I will get back to you as soon as I can.',
  contactTopics: ['Photography', 'Video', 'Writing', 'Something else'],
  thanksTitle: 'Thank you.',
  thanksText: 'Your message is on its way. I will get back to you soon.',
  ctaLine: 'A road, a place, a story.',
  ctaBold: 'Pull over, say hello.',
  footerLegal: '© 2026 Matt Schantz.',
  footerCredit: 'Designed and built by Dual-Stack Studio',
  hideFooterCredit: false,
  privacyLabel: 'Privacy Policy',
  contactNote: 'By sending this message you agree that I use your details only to reply to you.',
  musicEnabled: true,
  musicVolume: 17,
}

await client.createIfNotExists({_id: 'siteSettings', _type: 'siteSettings'})
const now = await client.getDocument('siteSettings')
const extra = {}
if (process.env.SEED_CTA_DARK && !now.ctaImageDark) extra.ctaImageDark = await img(process.env.SEED_CTA_DARK)
if (process.env.SEED_CTA_LIGHT && !now.ctaImageLight) extra.ctaImageLight = await img(process.env.SEED_CTA_LIGHT)
if (process.env.SEED_MUSIC && !now.musicFile) {
  const a = await client.assets.upload('file', fs.createReadStream(process.env.SEED_MUSIC), {filename: path.basename(process.env.SEED_MUSIC), contentType: 'audio/mpeg'})
  extra.musicFile = {_type: 'file', asset: {_type: 'reference', _ref: a._id}}
}
await client.patch('siteSettings').setIfMissing({...defaults, ...extra}).commit()
console.log('Site texts ready.')

// the privacy policy page: the text that ships with the site (../privacy-default.js), only if the page does not exist yet
const key = () => Math.random().toString(36).slice(2, 12)
const win = {}
vm.runInNewContext(fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'privacy-default.js'), 'utf8'), {window: win})
const D = win.PRIVACY_DEFAULT
function inline(text) {                                        // **bold**, *italic*, [text](url) to Portable Text spans
  const markDefs = [], children = []
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\((https?:[^)\s]+)\)/g
  let last = 0, m
  const span = (t, marks = []) => children.push({_type: 'span', _key: key(), text: t, marks})
  while ((m = re.exec(text))) {
    if (m.index > last) span(text.slice(last, m.index))
    if (m[1]) span(m[1], ['strong'])
    else if (m[2]) span(m[2], ['em'])
    else { const k = key(); markDefs.push({_key: k, _type: 'link', href: m[4]}); span(m[3], [k]) }
    last = m.index + m[0].length
  }
  if (last < text.length) span(text.slice(last))
  return {markDefs, children}
}
const body = D.body.map((b) => ({_type: 'block', _key: key(), style: b.t === 'h2' ? 'h2' : 'normal', ...(b.t === 'li' ? {listItem: 'bullet', level: 1} : {}), ...inline(b.x)}))
const existing = await client.getDocument('privacyPage')
if (!existing) { await client.create({_id: 'privacyPage', _type: 'privacyPage', title: D.title, updated: D.updated, body}); console.log('Privacy Policy page created.') }
else console.log('Privacy Policy page already exists, left as it is.')
