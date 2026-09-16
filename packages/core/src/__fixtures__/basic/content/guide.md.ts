import { defineMeta, md } from '@mdts/core'
import type { MarkdownLinkReference, MarkdownTemplate } from '@mdts/core'

import apiReference from './reference/api.md.ts?link'

const renderReference = (reference: MarkdownLinkReference): MarkdownTemplate => md`Read the ${reference}.`

export const meta = defineMeta({
  title: ['Gu', 'ide'].join(''),
})

export default md`${renderReference(apiReference)}
`
