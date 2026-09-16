# mdts contributor instructions

## Repository structure

- `packages/mdts/` contains the public Node and Effect CLI and its integration tests.
- `packages/vite-plugin-mdts/` contains the authoring API and Vite plugin.
- `examples/mdts-example/` is a consumer that exercises public workspace packages only.
- `packages/mdts/README.md` owns the CLI usage and authoring reference.

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
- `vp run w:pack` runs package-local `pack` tasks in workspace dependency order to build portable npm JavaScript and declaration files.
- `vp run npm:check` checks publishable package contents after packing.
- `vp run ci` runs check, test, example build, and npm packaging validation through the dependency graph.

Checks, fixes, tests, and example builds depend on `w:pack` so workspace consumers use the same `dist/` exports and CLI entry point as npm consumers.

The retained baseline is 24 tests across the CLI integration and plugin suites.
Preserve all fixtures and assertions, including the example's rendered Comark integrations.
When changing the CLI boundary, also run the actual `mdts` executable from the consumer directory and verify build output, preview HTTP routes, and lint exit status.
The example deliberately triggers lint errors. The `packages/mdts/src/__fixtures__/lint-knip/` configs exercise error, ignored, and warning-only outcomes without changing production configuration.

## Architecture

### Public behavior

- Keep the Node CLI entry point (`mdts`) and its Effect runtime. Do not substitute Bun or rewrite the rendering framework.
- Preserve public subpaths: `@mdts/cli`, `@mdts/cli/client`, `@mdts/cli/comark`, `@mdts/vite`, and `@mdts/vite/client`.
- Markdown builds replace the configured output directory. Lint compiles in memory without writing or clearing it.
- The CLI owns Vite root, document input, output, and internal plugins, and ignores external `vite.config.ts` discovery.

## Development tools

- **Vite+**: Preserve the complete formatter baseline, including `semi: false`, single quotes, print width 120, import/package sorting, and preserved Markdown wrapping. Keep type-aware lint and standard test discovery.
- **TypeScript**: Extend strictest and node-ts, retain ESNext checking and the required DOM/Vite types, and avoid root `include` overrides or redundant preset flags.
- **Nix and CI**: Update `flake.lock` with Nix inputs. CI uses `totto2727-org/monorepo/.github/actions/setup-nix@main`, then `setup-typescript@main`, and loads the shell with `eval "$(nix print-dev-env ...)"` before Vite+ tasks.

## Package-specific rules

- Bundle the pinned Effect platform implementation in the CLI to avoid its transitive prerelease range resolving an incompatible runtime outside this workspace. Keep its license in `packages/mdts/THIRD_PARTY_NOTICES.md`.
- Keep Effect and its platform packages compatible with the pinned `4.0.0-beta.65` runtime. Do not inherit an unrelated framework's Effect upgrade.
- Keep shared dependency versions in the workspace catalog and preserve the plugin's internal runtime dependencies.
- Publish `@mdts/cli` and `@mdts/vite` with public access. Keep the workspace root and example private. Ship built JavaScript and declaration files, not executable TypeScript in node_modules. Licensing remains unspecified until an explicit owner decision.

## npm publication

- `.github/workflows/publish.yml` publishes on pushes to `main`, including merged pull requests, using the shared Nix, TypeScript setup, and `publish-npm` actions on `@main`, matching effront.
- Publication is serialized, guarded to `totto2727-org/mdts`, and restricted to `@mdts/vite` and `@mdts/cli`. The root and example stay private. The command remains `mdts`.
- The workflow runs `vp run w:pack`, then the shared action with both package filters. The action runs filtered `vp pm publish -r --provenance`, resolves workspace/catalog dependencies, and skips versions already on npm. Do not stage or extract tarballs in the build or publish workflow.
- Public manifests point directly at `dist/` for exports and the CLI executable. Local consumers and npm users resolve the same entry points.
- Both packages start at stable version `0.1.0`, with public access, the npm registry, and the `latest` dist-tag. Keep them at the same release version and bump changed releases explicitly in the PR. There is no automatic version bump or tag trigger.
- Run `vp run --no-cache ci` before merging. The separate `npm:check` validation task creates inspectable tarballs under ignored `tmp/npm-check/`; publication does not use those artifacts.
- Verify installed tarball consumers, including build output, lint exit status, preview routes, and client type resolution without the workspace's Effect override.
- Before merging the publishing workflow, the owner must ensure both npm packages exist and configure each Trusted Publisher for GitHub owner `totto2727-org`, repository `mdts`, workflow `publish.yml`, and direct publication. No GitHub environment is configured. The owner performs initial publication if npm requires it.
- Use GitHub-hosted runners and job-scoped `id-token: write`, without long-lived npm tokens. Protect `main` and require the CI check before merging. Local checks and dry runs do not verify registry trust or scope ownership.
- Verify both published versions before claiming npm publication is complete. Do not change authentication settings or dispatch publication as part of local verification.
- Nix remains a development shell only. Native compilation and `package.nix` remain outside scope.
- References: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) and [pnpm publish](https://pnpm.io/cli/publish).

## Task-specific documentation

- When changing user-visible configuration or behavior: [CLI and authoring guide](packages/mdts/README.md).

_This AGENTS.md was generated from the [share-artifact skill](https://raw.githubusercontent.com/totto2727-org/agent/refs/heads/main/plugins/totto2727-coding/skills/share-artifact/SKILL.md) and [AGENTS template](https://raw.githubusercontent.com/totto2727-org/agent/refs/heads/main/plugins/totto2727-coding/skills/share-artifact/agents/template.md)._
