import { defineConfig } from '@mdts/core'

export default defineConfig({
  input: './content',
  lint: {
    knip: false,
  },
  output: './dist',
  vite: {
    logLevel: 'silent',
  },
})
