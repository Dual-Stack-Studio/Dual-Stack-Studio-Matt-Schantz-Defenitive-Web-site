/* The privacy policy text that ships with the site. It is shown if the dashboard cannot be reached, and it is also what
   `npm run seed` puts in the dashboard (Privacy Policy page), where Matt can edit it. Mini markup: **bold**, *italic*, [text](https://link).
   Each line is { t: 'h2' | 'p' | 'li', x: 'text' }. This is a plain-language template, not legal advice: Matt should read it and check it is true for him. */
window.PRIVACY_DEFAULT = {
  title: 'Privacy Policy',
  updated: '2026-11-01',
  body: [
    { t: 'p', x: 'This site belongs to Matt Schantz. This page explains in plain words what information the site collects, why, and what you can ask me to do with it.' },

    { t: 'h2', x: 'What I collect' },
    { t: 'p', x: '**The contact form.** If you write to me through the contact window, I receive your name, your email address, the topic you picked (optional) and your message. I use them only to answer you.' },
    { t: 'p', x: '**Nothing else about you.** The site has no analytics, no advertising and no tracking cookies. I do not build profiles of visitors.' },

    { t: 'h2', x: 'Where your message goes' },
    { t: 'p', x: 'Your message is delivered to my email by the service that runs the contact form or, when no form service is set up, it is written in your own email app and you send it yourself. Either way it ends up in my inbox. I do not sell it and I do not share it with anyone.' },

    { t: 'h2', x: 'Cookies and what your browser stores' },
    { t: 'p', x: 'The site sets **no cookies**. Your browser keeps two small preferences on your own device: whether you chose the dark or the light look, and whether you muted the music during your visit. They never leave your device.' },

    { t: 'h2', x: 'Services that make the site work' },
    { t: 'li', x: '**Hosting (Vercel).** When your browser asks for a page, the host receives standard technical data such as your IP address, browser type and the page requested.' },
    { t: 'li', x: '**Content (Sanity).** The photographs, videos and texts are delivered by Sanity, so your browser contacts its servers to load them.' },
    { t: 'li', x: '**Videos (YouTube).** Video thumbnails are loaded from YouTube. The video itself only loads when you click it, in YouTube\'s privacy-enhanced mode; from that moment YouTube\'s own privacy policy applies.' },
    { t: 'li', x: '**Fonts.** The fonts are hosted on this site, so nothing is requested from Google Fonts.' },
    { t: 'p', x: 'Links to other sites (Instagram, YouTube, the print shop on Pictorem) lead to services with their own privacy policies.' },

    { t: 'h2', x: 'How long I keep your message' },
    { t: 'p', x: 'Only as long as I need it to answer you and keep a record of our conversation, usually no more than two years. Then I delete it.' },

    { t: 'h2', x: 'Your rights' },
    { t: 'p', x: 'You can ask me what I hold about you, ask me to correct it, or ask me to delete it, by writing to the email address below. Depending on where you live (for example the European Union, the United Kingdom or California) the law gives you specific rights over your data, and I respect them wherever you are. If you live in the EU or the UK, you may also complain to your local data protection authority.' },

    { t: 'h2', x: 'Changes' },
    { t: 'p', x: 'If I change how the site works, I will update this page and its date.' },
  ],
}
