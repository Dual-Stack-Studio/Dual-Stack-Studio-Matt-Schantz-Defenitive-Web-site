import React from 'react'
import {Icon} from '@sanity/icons'

// @sanity/icons v5 exposes one <Icon symbol="..."/> instead of one component per icon
const make = (symbol) => () => <Icon symbol={symbol} />
export const HomeIcon = make('home')
export const CogIcon = make('cog')
export const ImagesIcon = make('images')
export const PlayIcon = make('play')
export const TextIcon = make('document-text')
export const LockIcon = make('lock')
