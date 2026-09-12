# mdts

`mdts` executes trusted TypeScript Markdown modules with Vite SSR, writes Markdown output, lint-checks generated documents, and serves a Comark HTML preview.

## Usage

Generate linked Markdown documents from the bundled consumer's `content/*.md.ts` modules.
After [source preparation](AGENTS.md#source-preparation), run this command from the workspace root:

```bash
vp run --filter mdts-example build
```

Expected result: six Markdown files under `examples/mdts-example/dist/`, including a guide whose links point to the generated reference documents.

```text
dist/SKILL.md
dist/guide.md
dist/lint-validation.md
dist/markdown-syntax.md
dist/reference/api.md
dist/reference/knip-orphan.md
```

The build replaces the configured output directory and writes Markdown, not a bundled HTML application.
Preview these documents with rendered math, Mermaid diagrams, syntax highlighting, and footnotes:

```bash
cd examples/mdts-example
vp exec mdts preview
```

Open the local URL printed by the CLI and select `markdown-syntax.md`.
The preview displays the rendered document and supports direct paths such as `/reference/api.md`.
Stop the preview with Ctrl+C.

## Key features

- Author Markdown with normal TypeScript functions, imports, typed metadata, and reusable footnotes.
- Resolve `?link` imports after collecting documents, including reciprocal document links.
- Lint source relationships with Knip and generated prose with markdownlint and English or Japanese textlint presets.
- Map lint diagnostics back to the originating `.md.ts` lines without writing build output.
- Render Comark previews with configurable math, Mermaid, Shiki, and footnote integrations.

## Prerequisites

- **Node.js 24**: The current CLI executes TypeScript source with Node and Effect.
- **Prepared source workspace**: Use the repository's pinned Vite+ and pnpm environment through [source preparation](AGENTS.md#source-preparation).

Only execute trusted document modules and configuration because they run as TypeScript code.

## Setup

This project is currently available as a [source workspace](https://github.com/totto2727-org/mdts).
Its packages remain private, and this repository does not provide an npm release or a Nix application package.
Follow [source preparation](AGENTS.md#source-preparation) to use the bundled consumer.
That consumer already declares the public CLI and authoring package as its only project dependency:

```json
{
  "devDependencies": {
    "mdts": "workspace:*"
  }
}
```

Its [configuration](examples/mdts-example/mdts.config.ts) and [TypeScript settings](examples/mdts-example/tsconfig.json) enable `mdts.config.ts` and the `mdts/client` types.

## API

The [CLI and authoring guide](docs/guide.md) covers configuration, build/lint/preview behavior, lint engines, Markdown authoring, and preview plugins.
Its [public entry points](docs/guide.md#public-entry-points) distinguish `mdts`, `mdts/client`, `mdts/comark`, and the lower-level `vite-plugin-mdts` integration.
From the bundled consumer directory, `vp exec mdts --help` lists commands and `vp exec mdts build --help` describes the configuration flag.
The example intentionally contains lint violations, so `vp exec mdts lint` reports findings and exits unsuccessfully.

## Development

For source preparation, repository structure, and maintenance commands, see [AGENTS.md](AGENTS.md).

## License

The extracted source paths did not declare a license at the recorded source commit. Licensing remains unspecified pending an explicit upstream decision.

_This README was generated from the [share-artifact skill](https://raw.githubusercontent.com/totto2727-org/agent/refs/heads/main/plugins/totto2727-coding/skills/share-artifact/SKILL.md) and [README template](https://raw.githubusercontent.com/totto2727-org/agent/refs/heads/main/plugins/totto2727-coding/skills/share-artifact/readme/template.md)._
