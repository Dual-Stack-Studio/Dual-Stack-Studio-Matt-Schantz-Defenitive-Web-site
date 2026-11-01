# Matt Schantz: content dashboard (Sanity)

This is the dashboard where Matt changes everything on the site. The website reads whatever is published here.

---

## For Matt: how to use it

Open the dashboard (the address Sebastian gives you, `https://matt-schantz.sanity.studio`) and sign in with your Google account.
The first page, **Start here**, explains each part.

**Nothing changes on the site until you press Publish** (bottom right). The site shows the change within a minute or so.

- **Photography projects**: *Create*, write the title and the date, choose the cover photo, then drag all the photos into **Photos**
  (many at once). Drag them up or down to change the order. Publish. The newest date goes first.
- **Videos**: *Create*, paste the YouTube link, write the title. Publish.
- **Writing**: *Create*, write the title and the date, then the text (subheads, quotes, bold, italic and photos are available). Publish.
- **Site texts and settings** (tabs at the top):
  - *Home page*: the big name (two lines), the main photo, the line under it, the moving words, the places.
  - *About*: the big sentence and the text.
  - *Menu and sections*: rename the menu words, **hide any part of the page** (About, Places, Subjects, Photography, Videos, Writing).
  - *Contact and links*: email, contact form address, Instagram, YouTube, extra links, the texts of the contact window, the photo and lines at the bottom.
  - *Footer*: the small print, the credit line and the name of the privacy link.
- **Privacy Policy** (left menu): the page people open from the footer. Edit the text if the site changes (a new service, analytics, a form provider) and update the date.
  - *Name, title and look*: site name, page title and description, which look people see first (dark or light), accent colours, hide the dark/light switch.
  - *Music*: turn the music on or off, upload your own MP3, set the volume.
- **To take something off the site without losing it**: open it, switch on **Hide from the site**, Publish. Switch it off to bring it back.
- **To delete for good**: open it, click the three dots next to Publish, then **Delete**.

Photos: upload the **biggest, best version you have** (up to about 6000 pixels on the long side). The dashboard keeps the original and
makes the smaller ones for phones and screens by itself, so nothing needs resizing. JPEG, PNG and WebP work.

---

## For Sebastian: maintenance

The project already exists (id `db7bbxau`, dataset `production`, public read) and the dashboard is deployed.

```
npm install
npx sanity login
npm run dev          # the dashboard at http://localhost:3333, to try changes to the schemas
npm run deploy       # publishes the dashboard at https://matt-schantz.sanity.studio after you change a schema
npm run seed         # fills "Site texts and settings" with today's words (never overwrites what is already there)
npm run photos       # PHOTOS_DIR=<folder> replaces the photos of the existing projects with bigger files (see the script header)
```

- Invite Matt: https://www.sanity.io/manage > the project > **Members** > Invite, role **Editor** (he needs a Google or email login).
- Schemas live in `schemaTypes/`. Every field is optional; an empty field keeps the text the site already has.
- The site reads the dashboard in `../cms.js` (one request, 8 s timeout). Parts with nothing in them hide themselves
  (no videos hides the Videos section and its menu links).

### If something looks wrong

- The site shows old content: hard refresh (Ctrl+F5). The dashboard's CDN and the browser keep answers for a short time.
- The site says the content could not be loaded: the address is probably not in the CORS origins
  (`npx sanity cors add https://the-address --no-credentials`), or Sanity is unreachable. The console has the details.
- Documents saved but not published are invisible to the site (drafts stay private).
- Sanity's free plan includes plenty for a portfolio; very large originals count against the asset storage and bandwidth quotas.
