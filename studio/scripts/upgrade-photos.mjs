// Replaces the photos already in the dashboard with the biggest versions Matt's original site publishes
// (the original file where it is listed, otherwise the 3840 px one; covers at 5120 px; home photo at 4416 px).
// The files come from a folder organised as  <folder>/<project-id>/NN.jpg, cover.jpg  and  <folder>/home/hero.jpg
// Run it from the studio folder:   PHOTOS_DIR=<folder> npx sanity exec scripts/upgrade-photos.mjs --with-user-token
// It only swaps the image of each existing entry (captions, order and everything else stay), so it is safe to run again.
import fs from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})
const DIR = process.env.PHOTOS_DIR
if (!DIR || !fs.existsSync(DIR)) { console.error('Set PHOTOS_DIR to the folder with the photos.'); process.exit(1) }

async function upload(file) {
  const asset = await client.assets.upload('image', fs.createReadStream(file), {filename: path.basename(file)})
  return asset._id
}
async function pool(items, size, fn) {
  let next = 0
  await Promise.all(Array.from({length: size}, async () => {
    while (next < items.length) { const i = next++; await fn(items[i], i) }
  }))
}
async function retry(fn, label) {
  for (let t = 1; t <= 4; t++) {
    try { return await fn() } catch (e) { console.warn(`  retry ${t} (${label}): ${e.message}`); await new Promise((r) => setTimeout(r, 2000 * t)) }
  }
  throw new Error('gave up: ' + label)
}

const projects = await client.fetch(`*[_type=="project" && _id match "project-*"]{_id, title, "photos": photos[]{_key}}`)
console.log(`Project ${client.config().projectId}: ${projects.length} projects`)
let n = 0
for (const p of projects) {
  const slug = p._id.replace(/^project-/, '')
  const folder = path.join(DIR, slug)
  if (!fs.existsSync(folder)) { console.log('skip (no folder):', p.title); continue }
  const files = fs.readdirSync(folder).filter((f) => /^\d+\.jpg$/.test(f)).sort()
  if (files.length !== (p.photos || []).length) { console.log(`skip ${p.title}: ${files.length} files but ${(p.photos || []).length} photos in the dashboard`); continue }
  console.log(`${p.title}: ${files.length} photos`)
  const refs = new Array(files.length)
  await pool(files, 3, async (f, i) => { refs[i] = await retry(() => upload(path.join(folder, f)), f); n++; if (n % 10 === 0) console.log('  uploaded', n) })
  const set = {}
  p.photos.forEach((ph, i) => { set[`photos[_key=="${ph._key}"].image.asset._ref`] = refs[i] })
  const cover = path.join(folder, 'cover.jpg')
  if (fs.existsSync(cover)) set['cover.asset._ref'] = await retry(() => upload(cover), 'cover')
  await client.patch(p._id).set(set).commit()
}
const hero = path.join(DIR, 'home', 'hero_face.jpg')   // the portrait of Matt (home splash), not the site background
if (fs.existsSync(hero)) {
  const id = await retry(() => upload(hero), 'hero')
  await client.createIfNotExists({_id: 'siteSettings', _type: 'siteSettings'})
  await client.patch('siteSettings').set({heroImage: {_type: 'image', asset: {_type: 'reference', _ref: id}}}).commit()
  console.log('Home photo replaced')
}
console.log('Done.')
