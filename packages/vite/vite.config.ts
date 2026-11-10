import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    clean: true,
    entry: { index: 'src/index.ts' },
    dts: true,
    copy: [{ from: 'src/client.d.ts', to: 'dist' }],
    format: ['esm'],
    platform: 'node',
    target: 'node24',
  },
  run: { tasks: { pack: { command: 'vp pack', cache: { input: [{ auto: true }, '!dist/**'], output: ['dist/**'] } } } },
})
