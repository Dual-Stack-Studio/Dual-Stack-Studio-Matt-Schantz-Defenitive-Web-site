import {HomeIcon, CogIcon, ImagesIcon, PlayIcon, TextIcon} from './components/icons'
import {WelcomePane} from './components/WelcomePane'

// Left-hand menu: "Site texts and settings" is a single page (not a list), the rest are lists.
export const structure = (S) =>
  S.list()
    .title('Matt Schantz')
    .items([
      S.listItem().title('Start here').id('welcome').icon(HomeIcon).child(S.component(WelcomePane).title('Start here')),
      S.divider(),
      S.listItem()
        .title('Site texts and settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site texts and settings')),
      S.divider(),
      S.documentTypeListItem('project').title('Photography projects').icon(ImagesIcon),
      S.documentTypeListItem('video').title('Videos').icon(PlayIcon),
      S.documentTypeListItem('writing').title('Writing').icon(TextIcon),
    ])
