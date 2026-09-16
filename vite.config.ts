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
      check: { command: 'vp check', dependsOn: ['w:pack'] },
      ci: { command: '', dependsOn: ['check', 'test', 'build', 'npm:check'] },
      fix: { command: 'vp check --fix', dependsOn: ['w:pack'] },
      test: { command: 'vp test run', dependsOn: ['w:pack'] },
      build: { command: 'vp run --filter mdts-example build', dependsOn: ['w:pack'] },
      'w:pack': { command: 'vp run -r pack' },
      'npm:check': {
        command:
          'vp pm pack --filter @mdts/cli --filter @mdts/core --filter @mdts/vite --pack-destination tmp/npm-check',
        dependsOn: ['w:pack'],
      },
    },
  },
})
