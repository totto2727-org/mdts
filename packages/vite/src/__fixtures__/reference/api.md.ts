import { defineMeta, md } from '@mdts/vite'

import guide from '../guide.md.ts?link'

export const meta = defineMeta({ title: 'Reference' })

export default md`Back to ${guide}.`
