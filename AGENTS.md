# mdts contributor instructions

## Layout

- `packages/mdts/` contains the public Node and Effect CLI plus its user guide and integration tests.
- `packages/vite-plugin-mdts/` contains the authoring API and Vite plugin.
- `examples/mdts-example/` is a consumer that exercises public workspace packages only.
- `docs/PROVENANCE.md` records the extraction source.

## Commands

Run commands from the repository root:

- `vp install` installs the pnpm workspace dependencies.
- `vp run fix` formats and applies safe lint fixes.
- `vp run check` checks formatting, lint, and types.
- `vp run test` runs standard Vitest discovery.
- `vp run --filter mdts-example build` builds the Markdown consumer example.

Root task definitions belong in `vite.config.ts`.
Keep task dependencies in `dependsOn`, never shell chaining.
Do not add `cache: false` to task definitions without an explicit cache correctness reason.
Temporary artifacts belong in ignored `tmp/` and must not be committed.

## Public behavior

Keep the Node CLI entry point (`mdts`) and its Effect runtime.
Preserve public subpaths: `mdts`, `mdts/client`, `mdts/comark`, `vite-plugin-mdts`, and `vite-plugin-mdts/client`.
Do not simplify retained tests, fixtures, or documented features during migration.
