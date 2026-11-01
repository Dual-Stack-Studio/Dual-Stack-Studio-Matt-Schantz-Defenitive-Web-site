import React from 'react'
import {Card, Stack, Heading, Text, Box, Flex} from '@sanity/ui'

// The first page Matt sees: what each part of the dashboard does, in plain words.
const parts = [
  ['Site texts and settings', 'Everything that is not a project: the big name, the line under it, the About text, the moving words, the places, your email and links, the contact window, the footer, the music and the look. Open it and use the tabs at the top.'],
  ['Photography projects', 'One card in the carousel and one full page of photos. Create one, choose the cover, drop all the photos into "Photos" (many at once) and drag them to change the order. The newest date comes first.'],
  ['Videos', 'Paste the YouTube link and write a title. The site shows the thumbnail and plays the video when someone clicks it.'],
  ['Writing', 'An essay, a note or a story. Add a title, a date and write the text. Subheads, quotes, bold, italic and photos inside the text are available.'],
]
const tips = [
  'Nothing changes on the site until you press Publish (bottom right). Changes appear within a minute or so.',
  'To take something off the site without deleting it, switch on "Hide from the site", then Publish.',
  'To delete something for good: open it, click the three dots next to Publish, then Delete.',
  'Photos: use the biggest, best version you have (the bigger the better, up to about 6000 pixels on the long side). The dashboard makes the smaller versions by itself, and the site always shows the sharpest one the screen can use.',
  'Hide a whole part of the page (for example Writing) in Site texts and settings > Menu and sections.',
]

export function WelcomePane() {
  return (
    <Card padding={5} height="fill" overflow="auto">
      <Box style={{maxWidth: 760, margin: '0 auto'}}>
        <Stack space={5}>
          <Stack space={3}>
            <Heading size={3}>Welcome, Matt</Heading>
            <Text size={2} muted>
              This is the dashboard of your site. Everything you see on the site (photos, words, links, music) lives here, and you can change, add or remove any of it.
            </Text>
          </Stack>
          <Stack space={4}>
            <Heading size={1}>What is where</Heading>
            {parts.map(([t, d]) => (
              <Card key={t} padding={4} radius={2} shadow={1}>
                <Stack space={2}>
                  <Text weight="semibold">{t}</Text>
                  <Text size={1} muted>{d}</Text>
                </Stack>
              </Card>
            ))}
          </Stack>
          <Stack space={3}>
            <Heading size={1}>Good to know</Heading>
            {tips.map((t) => (
              <Flex key={t} gap={3}>
                <Text size={1}>•</Text>
                <Text size={1}>{t}</Text>
              </Flex>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Card>
  )
}
