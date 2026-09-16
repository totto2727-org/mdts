import { defineConfig } from '@mdts/cli'
import { footnotes, math, Math, mermaid, Mermaid, shiki } from '@mdts/cli/comark'

export default defineConfig({
  input: './content',
  output: './dist',
  preview: {
    comark: {
      components: { Math, Mermaid },
      plugins: [footnotes(), math(), mermaid({ theme: 'tokyo-night', themeDark: 'tokyo-night' }), shiki()],
    },
  },
})
