import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    ignorePatterns: ['**/__fixtures__/**'],
    printWidth: 120,
    proseWrap: 'preserve',
    semi: false,
    singleQuote: true,
  },
  lint: {
    plugins: ['eslint', 'typescript', 'unicorn', 'oxc'],
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    tasks: {
      check: { command: '', dependsOn: ['js:check'] },
      ci: { command: '', dependsOn: ['check', 'test', 'build'] },
      fix: { command: '', dependsOn: ['js:fix'] },
      test: { command: '', dependsOn: ['js:test'] },
      'js:check': { command: 'vp check' },
      'js:fix': { command: 'vp check --fix' },
      'js:test': { command: 'vp test run' },
      build: { command: 'vp run -r build' },
    },
  },
})
