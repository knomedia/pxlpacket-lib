# pxlpacket

> Shared Zod schemas, types, and utilities for pxl-packet apps.

`pxlpacket` is a small TypeScript library used across the pxl-packet
ecosystem to validate FFmpeg encoding templates, job payloads, and
webhook events. It exports Zod 4 schemas (suffixed `Z`) plus the TS
types derived from them, so producers and consumers share one
source of truth.

## Status

Experimental. Shapes are still moving — pin an exact version when
you depend on this package.

## Install

```sh
pnpm add pxlpacket
```

`zod ^4.0.16` is a **peer dependency**, so make sure the host app
already has it installed.

## Usage

```ts
import { PxlPacketPayloadZ, type PxlPacketPayload } from 'pxlpacket';

const payload: PxlPacketPayload = PxlPacketPayloadZ.parse(input);
```

See [`src/index.ts`](./src/index.ts) for the full list of exported
schemas and types (FFmpeg template config, job payloads, webhook
event payloads, ffprobe inspect, etc.).

## Local development

### Prerequisites

- Node `>=20.19` — `.node-version` pins `20.19.5`.
- pnpm `10.11.0` — pinned via the `packageManager` field. Run
  `corepack enable` once and pnpm will fetch the correct version
  automatically.

There is **no `.env` / `.env.local`** to set up — this library
doesn't read any environment variables.

### Setup

```sh
git clone https://github.com/knomedia/pxlpacket-lib.git
cd pxlpacket-lib
pnpm install
```

### Scripts

- `pnpm dev` — `tsdown` in watch mode
- `pnpm build` — full build (JS via `tsdown`, `.d.ts` via `tsc` +
  `dts-bundle-generator`)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — Biome check
- `pnpm lint:fix` — Biome check + autofix
- `pnpm test:unit` — Vitest (threads pool)
- `pnpm clean` — remove `dist/`

Before pushing, the usual smoke check is:

```sh
pnpm lint && pnpm typecheck && pnpm test:unit
```

### Project layout

```
src/
  index.ts     public entry — re-exports types and schemas
  schemas/     all zod schemas (single index.ts)
  types/       types derived from schemas via z.infer
  client/      placeholder for browser-only utilities
```

For deeper conventions (Zod patterns, naming, build pipeline,
things to leave alone), see [`CLAUDE.md`](./CLAUDE.md).

## Publishing

1. Bump `version` in `package.json`.
2. `git tag vX.Y.Z` to match the new version.
3. `git push && git push --tags`.
4. `pnpm publish --access public`.

`prepublishOnly` runs `pnpm typecheck && pnpm clean && pnpm build`
so the published bundle is always rebuilt from source.

## License

ISC
