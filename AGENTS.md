# mdts contributor instructions

## Repository structure

- `packages/mdts/` contains the public Node and Effect CLI and its integration tests.
- `packages/vite-plugin-mdts/` contains the authoring API and Vite plugin.
- `examples/mdts-example/` is a consumer that exercises public workspace packages only.
- `docs/guide.md` owns the complete CLI and authoring guide preserved from the source repository.
- `docs/PROVENANCE.md` records the extraction source.

## Development commands

### Execution rules

- Run commands from the repository root unless a command explicitly selects the consumer directory.
- Use Vite+ for package management, formatting, lint, types, and tests. Do not use `npx` or `bunx`.
- Keep tasks in `vite.config.ts` and task dependencies in `dependsOn`, never shell chaining or duplicate package scripts.
- All tasks, including `fix`, retain default caching. Use `vp run --no-cache ci` for a fresh acceptance run instead of disabling task caches.
- Temporary artifacts belong in ignored `tmp/` and must not be committed. Remove temporary TypeScript consumers before whole-project checks because TypeScript discovery does not follow `.gitignore`.

### Source preparation

Acquire this independent repository, then enter its pinned development environment:

```bash
git clone https://github.com/totto2727-org/mdts.git
cd mdts
nix develop
vp install --frozen-lockfile
```

The development shell supplies Node.js 24, Vite+, and nixfmt.
Vite+ uses the `pnpm@12.3.4` package-manager pin in `package.json`.
For noninteractive automation, load the same environment rather than using `nix develop --command`:

```bash
eval "$(nix print-dev-env .#default)"
vp install --frozen-lockfile
```

### Standard tasks

- `vp install --frozen-lockfile` installs the pinned workspace dependencies.
- `vp run fix` formats and applies safe lint fixes.
- `vp run check` checks formatting, lint, and types.
- `vp run test` runs standard Vitest discovery.
- `vp run --filter mdts-example build` builds the Markdown consumer example.
- `vp run ci` runs check, test, and build through the dependency graph.

The retained baseline is 24 tests across the CLI integration and plugin suites.
Preserve all fixtures and assertions, including the example's rendered Comark integrations.
When changing the CLI boundary, also run the actual `mdts` executable from the consumer directory and verify build output, preview HTTP routes, and lint exit status.
The example deliberately triggers lint errors. The `packages/mdts/src/__fixtures__/lint-knip/` configs exercise error, ignored, and warning-only outcomes without changing production configuration.

## Architecture

### Public behavior

- Keep the Node CLI entry point (`mdts`) and its Effect runtime. Do not substitute Bun or rewrite the rendering framework.
- Preserve public subpaths: `mdts`, `mdts/client`, `mdts/comark`, `vite-plugin-mdts`, and `vite-plugin-mdts/client`.
- Markdown builds replace the configured output directory. Lint compiles in memory without writing or clearing it.
- The CLI owns Vite root, document input, output, and internal plugins, and ignores external `vite.config.ts` discovery.

## Development tools

- **Vite+**: Preserve the complete formatter baseline, including `semi: false`, single quotes, print width 120, import/package sorting, and preserved Markdown wrapping. Keep type-aware lint and standard test discovery.
- **TypeScript**: Extend strictest and node-ts, retain ESNext checking and the required DOM/Vite types, and avoid root `include` overrides or redundant preset flags.
- **Nix and CI**: Update `flake.lock` with Nix inputs. CI uses `totto2727-org/monorepo/.github/actions/setup-nix@main`, then `setup-typescript@main`, and loads the shell with `eval "$(nix print-dev-env ...)"` before Vite+ tasks.

## Package-specific rules

- Keep Effect and its platform packages compatible with the pinned `4.0.0-beta.65` runtime. Do not inherit an unrelated framework's Effect upgrade.
- Keep shared dependency versions in the workspace catalog and preserve the plugin's internal runtime dependencies.
- Keep all packages private. Do not publish, add registry acquisition claims, or invent a license without an explicit owner decision.

## Task-specific documentation

- When changing user-visible configuration or behavior: [CLI and authoring guide](docs/guide.md).
- When checking extraction history or source attribution: [source provenance](docs/PROVENANCE.md).

_This AGENTS.md was generated from the [share-artifact skill](https://raw.githubusercontent.com/totto2727-org/agent/refs/heads/main/plugins/totto2727-coding/skills/share-artifact/SKILL.md) and [AGENTS template](https://raw.githubusercontent.com/totto2727-org/agent/refs/heads/main/plugins/totto2727-coding/skills/share-artifact/agents/template.md)._
