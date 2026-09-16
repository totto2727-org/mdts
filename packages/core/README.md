# @mdts/core

Compile, lint, build, and preview TypeScript Markdown documents from your own Node.js tools without invoking a CLI.

## Usage

Compile an API reference in memory and check its documentation quality.
Create `mdts.config.ts`:

```ts
import { defineConfig } from '@mdts/core'

export default defineConfig({})
```

Create `content/reference.md.ts`:

```ts
import { defineMeta, md } from '@mdts/core'

export const meta = defineMeta({ title: 'API Reference' })
export default md`
The API is ready.
`
```

Create `check-documents.mjs`:

```js
import { compileMarkdownDocuments } from '@mdts/core/build'
import { lintMarkdown } from '@mdts/core/lint'

const root = process.cwd()
const documents = await compileMarkdownDocuments({ root })
console.log(documents.map((document) => document.fileName))
console.log(documents[0].source)
console.log(await lintMarkdown({ root }))
```

Run `node check-documents.mjs`.
The result includes `reference.md`, the `# API Reference` heading and `The API is ready.` body, followed by `{ diagnostics: [], errorCount: 0 }`.
Neither compilation nor linting writes or clears the output directory.
Only execute trusted document modules and configuration because they run as code.

## Key features

- Return compiled Markdown and source mappings for application-owned processing.
- Receive structured diagnostics from built-in Knip, markdownlint, and textlint engines.
- Build documents or create a preview server without CLI argument parsing or exit handling.

## Prerequisites

Node.js 24 or later and a project with a `package.json`.
Core compilation, lint, and preview workflows currently use Node.js and Vite.
They are not a browser or Cloudflare Workers runtime API.

## Setup

```bash
npm install --save-dev @mdts/core
```

## API

### Compile and build

```js
import { buildMarkdown, compileMarkdownDocuments } from '@mdts/core/build'

const documents = await compileMarkdownDocuments({ root: process.cwd() })
// Process documents in memory without replacing an output directory.
console.log(documents.length)
await buildMarkdown({ root: process.cwd() })
```

Both accept `MdtsProjectOptions` from `@mdts/core` with `root` and optional `configFile`.
`buildMarkdown` replaces the configured output directory, which defaults to `dist`.
`CompiledMarkdownDocument` and `MarkdownSourcePosition` describe the returned data and source mapping; `MarkdownCompileError` reports invalid document compilation.

Tools that already own a configured Vite server can use `compileResolvedMarkdownDocuments(config, server)` with the document plugin installed.
`resolveMdtsViteConfig(config, overrides)` applies core-owned document settings while merging project Vite options.
Without a supplied server, compilation creates and closes its own server.
A supplied server is borrowed: compilation does not close it; the caller retains lifecycle ownership.

### Lint

```js
import { lintMarkdown } from '@mdts/core/lint'

const result = await lintMarkdown({ root: process.cwd() })
for (const diagnostic of result.diagnostics) {
  console.log(diagnostic.filePath, diagnostic.line, diagnostic.engine, diagnostic.message)
}
```

`MdtsProjectOptions` accepts `root` and optional `configFile`.
`MdtsLintResult` contains ordered diagnostics and `errorCount`; diagnostics include source coordinates, engine, rule, severity, target, and scope.
The caller chooses how to display findings and whether to fail its operation.
Core does not set process exit status or print CLI-formatted diagnostics.
All three lint engines are core functionality, not optional adapter packages.

### Preview

```js
import { createMarkdownPreview } from '@mdts/core/preview'

const server = await createMarkdownPreview({ root: process.cwd() })
try {
  await server.listen()
  // Use the preview while the caller owns the server lifetime.
} finally {
  await server.close()
}
```

`MdtsProjectOptions` accepts `root` and optional `configFile`.
Creation returns a Vite server without calling `listen`, printing its URLs, binding terminal shortcuts, or deciding process lifetime.
The caller owns startup and cleanup.

### Configuration

Install `@mdts/core` as a development dependency in your project. It re-exports the Markdown authoring API from `@mdts/vite` and the supported Comark preview plugins, while keeping their packages as internal runtime dependencies.

Enable typed `?link` imports through the mdts client types:

```json
{
  "compilerOptions": {
    "types": ["@mdts/core/client"]
  }
}
```

Create `mdts.config.ts` in the project root. Both fields are optional and default to `content` and `dist`.

```ts
import { defineConfig } from '@mdts/core'
import { footnotes, math, Math, mermaid, Mermaid, shiki } from '@mdts/core/comark'

export default defineConfig({
  input: './content',
  lint: {
    markdownlint: {
      config: {
        default: true,
        MD013: false,
      },
    },
  },
  output: './dist',
  preview: {
    comark: {
      components: { Math, Mermaid },
      plugins: [footnotes(), math(), mermaid(), shiki()],
    },
  },
  vite: {
    server: {
      port: 4173,
    },
  },
})
```

Markdown modules also import their authoring helpers from `@mdts/core`:

```ts
import { defineMeta, defineNote, md, noteBody, noteRef } from '@mdts/core'
import type { MarkdownMetadata } from '@mdts/core'

const createTitle = (): string => 'Runtime title'

export const meta = defineMeta({ title: createTitle() })
```

Core workflows load only `mdts.config.ts`. It passes `configFile: false` to Vite+, so an existing `vite.config.ts` is ignored. The optional `vite` object is merged into the workflow defaults, while the project root, Markdown input, output directory, internal plugins, and disabled Vite config discovery remain owned by core workflows.

#### Lint configuration

`lintMarkdown` analyzes `.md.ts` source relationships through the JavaScript API of [`Knip`](https://knip.dev/reference/configuration) while compiling every document in memory for validation through the JavaScript APIs of [`markdownlint`](https://github.com/DavidAnson/markdownlint) and [`textlint`](https://github.com/textlint/textlint). It does not spawn any linter CLI and does not write or clear the configured output directory.

Every linter has an execution `target` and `scope`. markdownlint and textlint use `{ target: 'source', scope: 'file' }` because their generated-Markdown diagnostics are mapped back to individual `.md.ts` files. Knip uses `{ target: 'source', scope: 'project' }` because unused-file detection requires the complete source import graph. These literal values document each engine's capability and are available in resolved configuration and diagnostics.

Knip is enabled by default for its [`files` issue type](https://knip.dev/reference/issue-types) and requires a `package.json` in the mdts project root. Root-level `${input}/*.md.ts` documents are entries by default, while `${input}/**/*.md.ts` documents form the project. A nested Markdown source file that is not reachable from an entry is reported as `knip/files`. `lint.knip.entry`, `project`, and `ignoreFiles` customize those patterns, `rule` accepts `error`, `warn`, or `off`, and `knip: false` disables the engine.

```ts
import { defineConfig } from '@mdts/core'

export default defineConfig({
  lint: {
    knip: {
      entry: ['content/index.md.ts', 'content/guides/*.md.ts'],
      ignoreFiles: ['content/drafts/**'],
      project: ['content/**/*.md.ts'],
    },
  },
})
```

`lint.markdownlint` accepts `config`, `customRules`, `frontMatter`, `markdownItFactory`, and `noInlineConfig`. The default configuration enables markdownlint's standard rules and treats generated YAML metadata plus the mdts generated-file notice as front matter, so rules validate the authored document rather than mdts boilerplate. Set `markdownlint: false` to disable this engine.

Textlint uses the built-in English preset by default. `preset: 'en'` runs [`slopless`](https://github.com/berelevant-ai/slopless), while `preset: 'ja'` runs [`textlint-rule-preset-ja-technical-writing`](https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing). The presets are not combined because slopless is English-only and the Japanese technical-writing rules enforce Japanese-specific sentence, punctuation, and character conventions. `presetOptions` overrides individual built-in rules. Set `preset: false` to use only custom rules and presets, or set `textlint: false` to disable the engine.

`lint.textlint` also accepts JavaScript API entries through `rules`, `presets`, `filterRules`, and `plugins`. mdts provides the standard Markdown processor automatically unless a plugin with `pluginId: 'markdown'` is configured. Custom presets use their exported `rules` and `rulesConfig`; `options` overrides individual preset rule settings. Install additional rules, presets, filters, or processors in the consuming project and import their modules from `mdts.config.ts`.

Select and configure the built-in Japanese preset without installing it in the consuming project:

```ts
import { defineConfig } from '@mdts/core'

export default defineConfig({
  lint: {
    textlint: {
      preset: 'ja',
      presetOptions: {
        'sentence-length': { max: 120 },
      },
    },
  },
})
```

Diagnostics point to the originating `.md.ts` file. Literal Markdown body lines map to their template-literal lines, generated metadata maps to the corresponding metadata expression, and rendered runtime interpolations map to their TypeScript call expression.

### Public entry points

- `@mdts/core` exposes `defineConfig` and `loadMdtsConfig`, the Markdown authoring helpers below, the `markdown` Vite plugin and `markdownDocumentsId`, and their configuration and authoring types.
- `@mdts/core/client` enables typed `.md.ts?link` imports through `@mdts/vite/client`.
- `@mdts/core/comark` exposes `createHtmlRenderer`, `renderHtml`, and `renderHtmlFromDocument`, plus `footnotes`, `math`/`Math`, `mermaid`/`Mermaid`, and `shiki` for configurable preview rendering.
- `@mdts/vite` exposes the same authoring helpers, the Vite integration, and lower-level `compileMarkdownDocuments`, `generatedFileNotice`, and `MarkdownCompileError` for tooling integrations.
- `@mdts/vite/client` supplies the plugin's link-import declarations directly.

### Markdown authoring

A document exports `meta` with a title and a default Markdown body.
`defineMeta` validates metadata and freezes the resulting object; optional `frontmatter` accepts finite numbers, strings, booleans, null, arrays, and plain objects, but rejects circular values.
`md` retains a template whose interpolations can contain strings, numbers, bigints, other templates, and deferred document links.

Use a single note definition for a reference and its matching body:

```ts
import { defineMeta, defineNote, md, noteBody, noteRef } from '@mdts/core'

const notes = defineNote([{ slug: 'origin', body: 'Generated from trusted TypeScript.' }])

export const meta = defineMeta({ title: 'Release notes' })
export default md`The release is ready.${noteRef(notes, 'origin')}

${noteBody(notes, 'origin')}
`
```

The generated document contains `# Release notes`, a `[^1]` reference, and its `[^1]: Generated from trusted TypeScript.` definition.
`defineNote` assigns sequential string indexes and rejects duplicate slugs.
`noteRef` and `noteBody` reject unknown slugs.
The associated `MarkdownMetadata`, `MarkdownFrontmatterValue`, `MarkdownContent`, template/link types, and note types describe these values without requiring callers to construct internal template objects.

For document links, import `./reference/api.md.ts?link` and interpolate that value into `md`.
The link uses the target's metadata title and generated relative Markdown path.
Optional `text` and `hash` query parameters override link text and its fragment.
Documents are collected before links are resolved, so reciprocal links do not require cyclic module evaluation.

### Lower-level Vite integration

The `markdown({ directory })` plugin loads `.md.ts` modules and resolves link imports.
`markdownDocumentsId` identifies its virtual document collection.
Pass that collection to `compileMarkdownDocuments({ directory, modules, root })` to receive compiled documents with `fileName`, `source`, `sourcePath`, and `sourceMap` fields.
`CompiledMarkdownDocument` and `MarkdownSourcePosition` describe that result.
Invalid module exports, metadata, paths, or link targets fail compilation with `MarkdownCompileError`.
`generatedFileNotice` is the emitted instruction to edit the original `.md.ts` rather than generated Markdown.
`buildMarkdown` performs this integration and writes the output for consumers.

For the complete exported configuration/type declarations, see [mdts configuration](src/config.ts), [plugin exports](../vite/src/index.ts), and [authoring types](../vite/src/runtime.ts).

## Migration from 0.1

Imports of authoring helpers, configuration, and types move from `@mdts/cli` to `@mdts/core`.
Use `@mdts/core/client` instead of `@mdts/cli/client`, and `@mdts/core/comark` instead of `@mdts/cli/comark`.
The CLI package now provides only the `mdts` executable.
Install core directly when your document modules or application import it.

## Development

See [AGENTS.md](../../AGENTS.md) for contributor instructions.

## License

Licensing for mdts is unspecified. See [third-party notices](THIRD_PARTY_NOTICES.md) for the bundled dependency licenses.

_This README was generated from the [share-artifact skill](https://raw.githubusercontent.com/totto2727-org/agent/refs/heads/main/plugins/totto2727-coding/skills/share-artifact/SKILL.md) and [README template](https://raw.githubusercontent.com/totto2727-org/agent/refs/heads/main/plugins/totto2727-coding/skills/share-artifact/readme/template.md)._
