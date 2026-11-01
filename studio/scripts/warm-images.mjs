// Asks Sanity's image CDN for the sizes the site uses, once, so the first real visitor does not wait while each size is generated.
// Sanity makes a size the first time someone asks for it (about half a second to two seconds per photo) and then keeps it.
// Run it after publishing new photos:   npm run warm
// It uses the same sizes as ../imgsz.js (hero, carousel/mosaic, lightbox) and asks the way Chrome does (AVIF/WebP).
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})
const HERO = [1280, 1600, 1920, 2560, 3200], MID = [960, 1280, 1600, 1920], FULL = [1280, 1600, 1920, 2560, 3200, 3840]
const q = (w, quality) => `?w=${w}&q=${quality}&fit=max&auto=format`

const data = await client.fetch(`{
  "hero": *[_id=="siteSettings"][0].heroImage.asset->url,
  "projects": *[_type=="project" && !(hidden==true)]{"cover": cover.asset->url, "photos": photos[].image.asset->url}
}`)

const jobs = []
if (data.hero) HERO.forEach((w) => jobs.push(data.hero + q(w, 88)))
for (const p of data.projects) {
  if (p.cover) { MID.forEach((w) => jobs.push(p.cover + q(w, 84))); FULL.forEach((w) => jobs.push(p.cover + q(w, 90))) }
  for (const u of p.photos || []) { MID.forEach((w) => jobs.push(u + q(w, 84))); jobs.push(u + '?w=640&q=74&fit=max&auto=format') }
}
console.log(`${jobs.length} requests`)

let done = 0, bytes = 0, failed = 0
async function run(url) {
  for (let t = 0; t < 3; t++) {
    try {
      const r = await fetch(url, {headers: {Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'}})
      if (!r.ok) throw new Error(String(r.status))
      bytes += (await r.arrayBuffer()).byteLength
      return
    } catch (e) { await new Promise((res) => setTimeout(res, 1000 * (t + 1))) }
  }
  failed++
}
let next = 0
await Promise.all(Array.from({length: 6}, async () => {
  while (next < jobs.length) {
    await run(jobs[next++])
    if (++done % 50 === 0) console.log(`  ${done}/${jobs.length}`)
  }
}))
console.log(`Done: ${jobs.length - failed} ready, ${failed} failed, ${(bytes / 1e6).toFixed(0)} MB`)
