import { defineConfig } from '@mdts/cli'
import { footnotes } from '@mdts/cli/comark'

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
