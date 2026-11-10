export default {
  lint: {
    ignorePatterns: ['content/SKILL.md.ts'],
  },
  run: {
    tasks: {
      build: {
        command: 'vp exec node node_modules/@mdts/cli/dist/cli.mjs build',
        cache: {
          input: [{ auto: true }, '!dist/**'],
        },
      },
    },
  },
}
