import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    clean: true,
    entry: { cli: 'src/cli.ts' },
    dts: true,
    // Bundle the workspace-pinned platform code rather than resolving its broad prerelease range on installation.
    deps: {
      alwaysBundle: [/^@effect\/platform-node(?:-shared)?(?:\/|$)/],
      onlyBundle: [/^@effect\/platform-node(?:-shared)?(?:\/|$)/],
    },
    format: ['esm'],
    platform: 'node',
    target: 'node24',
  },
  run: { tasks: { pack: { command: 'vp pack', cache: { input: [{ auto: true }, '!dist/**'], output: ['dist/**'] } } } },
})
