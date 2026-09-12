# mdts

`mdts` executes trusted TypeScript Markdown modules with Vite SSR, writes Markdown output, lint-checks generated documents, and serves a Comark HTML preview.

The published CLI and authoring API are in [`packages/mdts`](packages/mdts/README.md).
The Vite authoring plugin is in [`packages/vite-plugin-mdts`](packages/vite-plugin-mdts/).
A consumer example is in [`examples/mdts-example`](examples/mdts-example/).

## Development

Use the Nix development shell or install Node.js 24 and pnpm 12.

```sh
vp install
vp run fix
vp run check
vp run test
vp run --filter mdts-example build
```

Repository-only commands and package layout are documented in [AGENTS.md](AGENTS.md).
Source provenance is recorded in [docs/PROVENANCE.md](docs/PROVENANCE.md).

## License

The extracted source paths did not declare a license at the recorded source commit. Licensing remains unspecified pending an explicit upstream decision.
