import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: { index: 'src/index.ts' },
    dts: true,
    copy: [{ from: 'src/client.d.ts', to: 'dist' }],
    format: ['esm'],
    platform: 'node',
    target: 'node24',
  },
  run: { tasks: { pack: { command: 'vp pack', output: ['dist/**'] } } },
})
