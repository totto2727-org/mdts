import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: { config: 'src/config.ts', comark: 'src/comark.ts', cli: 'src/cli.ts' },
    dts: true,
    copy: [{ from: 'src/client.d.ts', to: 'dist' }],
    // Bundle the workspace-pinned platform code rather than resolving its broad prerelease range on installation.
    deps: {
      alwaysBundle: [/^@effect\/platform-node(?:-shared)?(?:\/|$)/],
      onlyBundle: [/^@effect\/platform-node(?:-shared)?(?:\/|$)/],
    },
    format: ['esm'],
    platform: 'node',
    target: 'node24',
  },
  run: { tasks: { pack: { command: 'vp pack', output: ['dist/**'] } } },
})
