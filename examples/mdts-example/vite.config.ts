import { fileURLToPath } from 'node:url'

import cliPackage from '@mdts/cli/package.json' with { type: 'json' }

// A clean install cannot create the shim until pack has generated the declared executable.
const cliEntry = fileURLToPath(new URL(cliPackage.bin.mdts, import.meta.resolve('@mdts/cli/package.json')))

export default {
  lint: {
    ignorePatterns: ['content/SKILL.md.ts'],
  },
  run: {
    tasks: {
      build: {
        command: `node ${JSON.stringify(cliEntry)} build`,
        cache: {
          input: [{ auto: true }, '!dist/**'],
          output: ['dist/**'],
        },
      },
    },
  },
}
