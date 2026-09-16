import { defineConfig } from '@mdts/core'
import { footnotes } from '@mdts/core/comark'

export default defineConfig({
  input: './content',
  output: './dist',
  preview: {
    comark: {
      plugins: [footnotes()],
    },
  },
  vite: {
    logLevel: 'silent',
    server: {
      port: 0,
      strictPort: true,
    },
  },
})
