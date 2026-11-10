# Template configuration differences

The common configuration follows `vite-plus-app` at `70c95e4f874019368e88df0d7070eff3698665ac` and `vite-plus-lib` at `bfe72427c4507d17d76da37506476641f9669c9c`.
These are configuration references, not mdts runtime upstreams.

- mdts retains Node.js 24 for its published library and CLI contracts instead of the app template's Node.js 26 requirement.
  The `.node-version` pin matches the development shell's Node.js 24.19.0.
- TypeScript retains bundler resolution, ESNext modules, and DOM and Vite client types because document modules run through Vite.
  NodeNext resolution would change the authoring contract.
- The root uses the template's TypeScript 7 checker, but the Vite plugin retains TypeScript 5.9.3 in a named compiler catalog.
  The plugin needs the compiler API, which TypeScript 7 does not expose.
- Root tasks coordinate package-local portable JavaScript and declaration builds before checks, tests, and the consumer build.
  The consumer invokes the public package's built CLI entry because a clean install cannot create an executable shim before that entry exists.
  There is no native executable or Nix application package.
- Effect and its platform implementation remain pinned to `4.0.0-beta.65`.
  Core and CLI bundle the platform implementation and retain its third-party notices.
- Fixture formatting exclusions preserve intentional document inputs.
  Standard test discovery covers core, CLI, and Vite rather than only a root `src` directory.
- Dependency lifecycle builds are denied, including optional `msgpackr-extract` acceleration.
  The workspace enforces the template's one-day release age without exclusions.
- CI has one `check` job on `ubuntu-latest` and does not disable checkout credential persistence, as explicitly requested.
  The existing guarded npm workflow is retained without new publication or deployment triggers.
  No publication is run by local validation.
- Nix remains a development shell only, with a hook-free `ci` shell and an interactive shell that runs `vp config`.
  The Vite+ Nix input follows the app template's locked revision while mdts retains its existing nixpkgs lock.
