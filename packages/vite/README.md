# @mdts/vite

Integrate TypeScript Markdown documents into Vite-based documentation tools.
For the ready-to-use document CLI, use [`@mdts/cli`](../cli/README.md).

## Usage

Compile a reference document through a Vite server.
Create `content/reference.md.ts`:

```ts
import { defineMeta, md } from '@mdts/vite'

export const meta = defineMeta({ title: 'Reference' })
export default md`
The API is ready.
`
```

Create `compile.mjs`:

```js
import { compileMarkdownDocuments, markdown, markdownDocumentsId } from '@mdts/vite'
import { createServer } from 'vite'

const root = process.cwd()
const server = await createServer({
  appType: 'custom',
  configFile: false,
  plugins: [markdown({ directory: 'content' })],
  root,
})

try {
  const modules = await server.ssrLoadModule(markdownDocumentsId)
  const documents = compileMarkdownDocuments({ directory: 'content', modules: modules.default, root })
  for (const document of documents) {
    console.log(document.fileName)
    console.log(document.source)
  }
} finally {
  await server.close()
}
```

Run `node compile.mjs` to print `reference.md` and its Markdown body, including the `# Reference` heading and `The API is ready.` text.
The compiler returns documents in memory without writing files.
Only load trusted document modules because their TypeScript runs as code.

## Key features

- Load Markdown document modules through Vite.
- Resolve document links to generated Markdown paths.
- Return generated documents and source mappings for custom tooling.

## Prerequisites

Node.js 24 or later and a project with a `package.json`.
This version uses the Vite+ core exposed through the `vite` package alias below.

## Setup

```bash
npm install --save-dev @mdts/vite vite@npm:@voidzero-dev/vite-plus-core@0.2.8
```

## API

- `markdown({ directory })` registers document loading and `?link` resolution with Vite.
- `markdownDocumentsId` identifies the virtual document collection loaded in the example above.
- `compileMarkdownDocuments({ directory, modules, root })` returns documents containing `fileName`, `source`, `sourcePath`, and `sourceMap`.
- `MarkdownCompileError` reports invalid documents or unresolved links. `generatedFileNotice` contains the notice inserted into generated Markdown.
- `@mdts/vite/client` declares typed `?link` imports. Add it to `compilerOptions.types` in your TypeScript configuration.

The [authoring reference](../core/README.md#markdown-authoring) documents the shared `defineMeta`, `defineNote`, `md`, `noteRef`, and `noteBody` helpers and associated types. Import them from `@mdts/vite` when using this package directly.

## Development

See [AGENTS.md](../../AGENTS.md).

## License

See the [project license status](../../README.md#license).

_This README was generated from the [share-artifact skill](https://raw.githubusercontent.com/totto2727-org/agent/refs/heads/main/plugins/totto2727-coding/skills/share-artifact/SKILL.md) and [README template](https://raw.githubusercontent.com/totto2727-org/agent/refs/heads/main/plugins/totto2727-coding/skills/share-artifact/readme/template.md)._
