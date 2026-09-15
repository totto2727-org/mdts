import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    arrowParens: 'always',
    experimentalSortImports: {
      ignoreCase: true,
      newlinesBetween: true,
      order: 'asc',
    },
    experimentalSortPackageJson: true,
    ignorePatterns: ['**/__fixtures__/**'],
    jsxSingleQuote: true,
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
      check: { command: 'vp check' },
      ci: { command: '', dependsOn: ['check', 'test', 'build', 'npm:check'] },
      fix: { command: 'vp check --fix' },
      test: { command: 'vp test run' },
      build: { command: 'vp run -r build' },
      pack: { command: 'vp run -r pack' },
      'npm:check': {
        command: 'vp pm pack --filter @mdts/cli --filter @mdts/vite-plugin --pack-destination tmp/npm-check',
        dependsOn: ['pack'],
      },
    },
  },
})
