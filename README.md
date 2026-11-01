# Matt Schantz: the site

A static site (plain HTML, CSS and JavaScript, no build step) whose content lives in a Sanity dashboard.
Matt changes photos, words, links, music and sections in the dashboard; the site shows the change within a minute, with no one touching the code.

```
index.html, style.css, light.css   the design (dark look and light look)
app.js, loader.js                  the behaviour (carousel, mosaic, lightbox, reader, contact window, music)
cms.js, cms-config.js              asks Sanity for the content and puts it on the page
studio/                            the dashboard (Sanity Studio) and its schemas
privacy.html, privacy.css          the privacy policy page (text comes from the dashboard; privacy-default.js is the built-in copy)
fonts/, fonts.css                  the fonts, hosted on the site (no request goes to Google)
vercel.json                        clean URLs (/privacy instead of /privacy.html)
```

Nothing about Matt's content is stored in this repository: photos, texts, links and music are all in the dashboard (the site folder has no photos at all).

## What the dashboard controls

Everything: the big name and the line under it, the main photo, About, the moving words, the places, the menu words, which parts of
the page show, every project (cover and photos), videos, writing, email, contact form address, Instagram, YouTube and extra links,
the contact window texts, the photo and lines at the bottom, the footer, the page title and description, the dark/light default,
the accent colours and the background music. See `studio/README.md` for the guide Matt reads.

## Publish the site (any static host)

The site needs no server. Upload this folder (without `studio/`, it is harmless if included) to any static host:

- **GitHub Pages**: push to a repository, Settings > Pages > Deploy from branch `main` / root. The file `.nojekyll` is already there.
- **Netlify** or **Cloudflare Pages**: connect the repository, no build command, publish directory `/`.
- **Vercel**: import the repository, framework "Other", no build command, output directory `.`.

Then allow the new address to read the dashboard's content (once per address):

```
cd studio
npx sanity cors add https://the-address-of-the-site --no-credentials
```

(or sanity.io/manage > the project > API > CORS origins; do not tick "Allow credentials").

### Using mattschantz.com

The domain is on Adobe Portfolio today. To point it here, Matt (or whoever holds the domain) changes the DNS records at the registrar
to the ones the host asks for, and the host issues the certificate by itself. Adobe Portfolio keeps working until that moment.
After that, add `https://mattschantz.com` (and `https://www.mattschantz.com`) to the CORS origins as above.

### Privacy

- The site sets no cookies and has no analytics; the browser only stores the dark/light choice and the mute choice.
- The privacy page (`/privacy`) is edited in the dashboard under **Privacy Policy** (left menu). If the dashboard cannot be reached, the page shows the text in `privacy-default.js`.
- If anything is added later that sets cookies or tracks visitors (analytics, ads, pixels, embeds that load without a click), update that page and add a consent banner.
- The text is a plain-language template, not legal advice. Matt should read it and keep it true (for example the two-year retention and the services named in it).

### Things that are fixed in the code (not in the dashboard)

- Social-media link previews (the picture and text when the link is shared) use the title and description written in `index.html`;
  the dashboard changes them for browsers and Google, but chat apps do not run scripts. Edit the `<title>` and `<meta name="description">`
  in `index.html` if they should match.
- The fonts (self-hosted in `fonts/`), the loading curtain animation, the layout of the carousel and the mosaic.
- When you change a file, raise the version text (`20261101b` today) in `index.html` and `cms.js` so visitors do not get stale copies.

## Local preview

```
npx http-server . -p 8080 -c-1
```

and open http://localhost:8080 (port 8080 is already allowed by the dashboard). Another port needs `npx sanity cors add http://localhost:PORT`.

## Photo quality

The dashboard keeps the original file Matt uploads. The site asks Sanity for the size it needs (up to 3840 px wide, quality 90, and
never larger than the original) and the browser gets WebP or AVIF where it can, so photos are sharp on phones and big screens without
Matt resizing anything. Upload the biggest, best version you have.

## Music

The sample track is "Valley Sunset" from Mixkit. Read the Mixkit licence (https://mixkit.co/license/) before publishing with it, or
upload Matt's own track in the dashboard (Site texts and settings > Music).
