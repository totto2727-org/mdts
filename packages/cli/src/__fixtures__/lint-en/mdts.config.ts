import { defineConfig } from '@mdts/cli'

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
