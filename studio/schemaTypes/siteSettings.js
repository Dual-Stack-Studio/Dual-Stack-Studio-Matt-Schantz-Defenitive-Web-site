import {defineType, defineField, defineArrayMember} from 'sanity'

// Everything on the site that is not a project, a video or a piece of writing: names, texts, links, photos, music, colours.
// There is only one of these. Every field is optional: an empty field simply keeps the text the site already has.
const hex = (r) =>
  r.custom((v) => (!v || /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v) ? true : 'Use a colour like #3aa0bd (a # and 3 or 6 letters/numbers).'))

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site texts and settings',
  type: 'document',
  groups: [
    {name: 'home', title: 'Home page', default: true},
    {name: 'about', title: 'About'},
    {name: 'menu', title: 'Menu and sections'},
    {name: 'contact', title: 'Contact and links'},
    {name: 'footer', title: 'Footer'},
    {name: 'look', title: 'Name, title and look'},
    {name: 'music', title: 'Music'},
  ],
  fields: [
    // ---------------------------------------------------------------- Home page
    defineField({
      name: 'heroImage',
      title: 'Main photo (top of the home page)',
      type: 'image',
      group: 'home',
      description: 'The big photo under your name. A wide photo where the face or the subject sits in the middle works best.',
    }),
    defineField({name: 'heroImageAlt', title: 'Describe the main photo (for screen readers)', type: 'string', group: 'home'}),
    defineField({name: 'heroLine1', title: 'Big name, first line', type: 'string', group: 'home', description: 'For example: Matt'}),
    defineField({name: 'heroLine2', title: 'Big name, second line', type: 'string', group: 'home', description: 'For example: Schantz. The second line is stretched to fill the width of the screen.'}),
    defineField({
      name: 'heroTagline',
      title: 'Line under your name',
      type: 'text',
      rows: 3,
      group: 'home',
      description: 'Press Enter to start a new line.',
    }),
    defineField({
      name: 'subjects',
      title: 'Subjects (the moving words)',
      type: 'array',
      group: 'home',
      of: [defineArrayMember({type: 'string'})],
      description: 'Short words or phrases that scroll across the page, for example Landscape Photography or Wildlife. Drag to reorder.',
    }),
    defineField({
      name: 'places',
      title: 'Places',
      type: 'array',
      group: 'home',
      of: [defineArrayMember({type: 'string'})],
      description: 'Place names shown in a grid. Twelve is a good number.',
    }),

    // ---------------------------------------------------------------- About
    defineField({name: 'aboutHeading', title: 'Big sentence', type: 'text', rows: 2, group: 'about', description: 'Press Enter to start a new line.'}),
    defineField({name: 'aboutText', title: 'About text', type: 'text', rows: 8, group: 'about'}),

    // ---------------------------------------------------------------- Menu and sections
    defineField({
      name: 'hiddenSections',
      title: 'Hide parts of the page',
      type: 'array',
      group: 'menu',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: 'About (text and photos)', value: 'about'},
          {title: 'Places (the grid of names)', value: 'places'},
          {title: 'Subjects (the moving words)', value: 'subjects'},
          {title: 'Photography (the carousel of projects)', value: 'photography'},
          {title: 'Videos', value: 'videos'},
          {title: 'Writing', value: 'writing'},
        ],
        layout: 'grid',
      },
      description: 'Tick what you do not want to show. The menu links disappear too. A part with nothing in it hides by itself.',
    }),
    defineField({name: 'navAbout', title: 'Menu: About', type: 'string', group: 'menu', description: 'The words in the menu. Empty keeps the original word.'}),
    defineField({name: 'navPhotography', title: 'Menu: Photography', type: 'string', group: 'menu'}),
    defineField({name: 'navVideos', title: 'Menu: Videos', type: 'string', group: 'menu'}),
    defineField({name: 'navWriting', title: 'Menu: Writing', type: 'string', group: 'menu'}),
    defineField({name: 'navContact', title: 'Menu: Contact', type: 'string', group: 'menu'}),
    defineField({name: 'helloLabel', title: 'Button in the top bar', type: 'string', group: 'menu', description: 'For example: Say hello'}),
    defineField({name: 'labelSubjects', title: 'Section title: Subjects', type: 'string', group: 'menu'}),
    defineField({name: 'labelPortfolio', title: 'Section title: Portfolio', type: 'string', group: 'menu'}),

    // ---------------------------------------------------------------- Contact and links
    defineField({name: 'email', title: 'Email address', type: 'string', group: 'contact', description: 'Where messages are sent when there is no contact form address below, and the address on the privacy page.'}),
    defineField({name: 'showEmail', title: 'Show the email address in the contact window', type: 'boolean', group: 'contact', initialValue: false, description: 'Off keeps your address out of the page, so robots cannot collect it. Messages still reach you through the contact form.'}),
    defineField({
      name: 'formEndpoint',
      title: 'Contact form address',
      type: 'url',
      group: 'contact',
      description: 'The web address of the service that forwards the messages to your email, for example https://formspree.io/f/xxxxxxxx (see the README, "Contact form"). While it is empty, the Send button opens the visitor’s own email app with the message written.',
    }),
    defineField({name: 'instagramUrl', title: 'Instagram link', type: 'url', group: 'contact'}),
    defineField({name: 'youtubeUrl', title: 'YouTube channel link', type: 'url', group: 'contact'}),
    defineField({
      name: 'otherLinks',
      title: 'More links (optional)',
      type: 'array',
      group: 'contact',
      description: 'Any other place people can find you (TikTok, Vimeo, a shop). They are added next to Instagram and YouTube.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'link',
          fields: [
            defineField({name: 'label', title: 'Name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'url', title: 'Link', type: 'url', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        }),
      ],
    }),
    defineField({name: 'contactTitle', title: 'Contact window: title', type: 'text', rows: 2, group: 'contact', description: 'Press Enter to start a new line.'}),
    defineField({name: 'contactIntro', title: 'Contact window: text', type: 'text', rows: 3, group: 'contact'}),
    defineField({
      name: 'contactTopics',
      title: 'Contact window: topics to choose from',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({type: 'string'})],
      description: 'The little buttons people can tick (for example Photography, Video). Leave it empty to remove them.',
    }),
    defineField({name: 'contactNote', title: 'Contact window: note under the Send button', type: 'string', group: 'contact', description: 'A short sentence about how you use their details. A link to the privacy page follows it.'}),
    defineField({name: 'thanksTitle', title: 'After sending: title', type: 'string', group: 'contact'}),
    defineField({name: 'thanksText', title: 'After sending: text', type: 'text', rows: 2, group: 'contact'}),
    defineField({name: 'ctaLine', title: 'Big photo at the bottom: small line', type: 'string', group: 'contact', description: 'For example: A road, a place, a story.'}),
    defineField({name: 'ctaBold', title: 'Big photo at the bottom: bold line', type: 'string', group: 'contact', description: 'For example: Pull over, say hello.'}),
    defineField({name: 'ctaImageDark', title: 'Big photo at the bottom (dark look)', type: 'image', group: 'contact'}),
    defineField({
      name: 'ctaImageLight',
      title: 'Big photo at the bottom (light look)',
      type: 'image',
      group: 'contact',
      description: 'A photo without large white areas works best here. If empty, the dark-look photo is used.',
    }),

    // ---------------------------------------------------------------- Footer
    defineField({name: 'footerLegal', title: 'Small print', type: 'string', group: 'footer', description: 'For example: © 2026 Matt Schantz.'}),
    defineField({name: 'footerCredit', title: 'Credit line', type: 'string', group: 'footer', description: 'Empty keeps the original line.'}),
    defineField({name: 'hideFooterCredit', title: 'Hide the credit line', type: 'boolean', group: 'footer', initialValue: false}),
    defineField({name: 'privacyLabel', title: 'Privacy page: name of the link', type: 'string', group: 'footer', description: 'The link in the footer and under the contact form. For example: Privacy Policy. The page itself is edited under "Privacy Policy" in the left menu.'}),
    defineField({name: 'footerExtra', title: 'Extra small word (optional)', type: 'string', group: 'footer', description: 'For example: Privacy Policy. It is shown as text only.'}),

    // ---------------------------------------------------------------- Name, title and look
    defineField({name: 'siteName', title: 'Site name', type: 'string', group: 'look', description: 'Shown while the site loads and in the page tab.'}),
    defineField({name: 'pageTitle', title: 'Page title (browser tab and Google)', type: 'string', group: 'look'}),
    defineField({name: 'pageDescription', title: 'Page description (Google)', type: 'text', rows: 3, group: 'look'}),
    defineField({name: 'loadingText', title: 'Text while the site loads', type: 'string', group: 'look', description: 'For example: Loading the photographs'}),
    defineField({
      name: 'defaultTheme',
      title: 'Look people see first',
      type: 'string',
      group: 'look',
      options: {list: [{title: 'Dark', value: 'dark'}, {title: 'Light', value: 'light'}], layout: 'radio'},
      initialValue: 'dark',
      description: 'People can switch with the sun/moon button; their choice is remembered on their device.',
    }),
    defineField({name: 'hideThemeSwitch', title: 'Hide the dark/light switch', type: 'boolean', group: 'look', initialValue: false}),
    defineField({name: 'accentDark', title: 'Accent colour, dark look (optional)', type: 'string', group: 'look', description: 'The teal of the name, the lines and the buttons. For example #3aa0bd. Empty keeps the original.', validation: hex}),
    defineField({name: 'accentLight', title: 'Accent colour, light look (optional)', type: 'string', group: 'look', description: 'For example #0b5f7f. Empty keeps the original.', validation: hex}),

    // ---------------------------------------------------------------- Music
    defineField({name: 'musicEnabled', title: 'Play background music', type: 'boolean', group: 'music', initialValue: true, description: 'Visitors always have a button to turn it off.'}),
    defineField({
      name: 'musicFile',
      title: 'Music file',
      type: 'file',
      group: 'music',
      options: {accept: 'audio/*'},
      description: 'An MP3 you have the right to use. A calm track of a few minutes works best: it loops softly. With no file there is no music and the button disappears.',
    }),
    defineField({
      name: 'musicVolume',
      title: 'Music volume (1 to 100)',
      type: 'number',
      group: 'music',
      initialValue: 17,
      validation: (r) => r.min(1).max(100),
      description: 'It starts low on purpose: 17 sits under voices and videos.',
    }),
  ],
  preview: {prepare: () => ({title: 'Site texts and settings'})},
})
