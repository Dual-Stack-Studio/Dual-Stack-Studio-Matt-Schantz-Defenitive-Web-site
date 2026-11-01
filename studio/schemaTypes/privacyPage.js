import {defineType, defineField, defineArrayMember} from 'sanity'

// The privacy policy page (privacy.html on the site). There is only one of these.
export const privacyPage = defineType({
  name: 'privacyPage',
  title: 'Privacy Policy',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', initialValue: 'Privacy Policy'}),
    defineField({name: 'updated', title: 'Last updated', type: 'date', description: 'Change it every time you edit the text.'}),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      description: 'The page people open from the footer. It explains what the site does with their information; if something on the site changes (a new service, analytics, a form provider), update it here.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Paragraph', value: 'normal'},
            {title: 'Section title', value: 'h2'},
            {title: 'Small title', value: 'h3'},
          ],
          lists: [{title: 'Bullets', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [defineField({name: 'href', type: 'url', title: 'Address', validation: (r) => r.uri({scheme: ['http', 'https', 'mailto']})})],
              },
            ],
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Privacy Policy'})},
})
