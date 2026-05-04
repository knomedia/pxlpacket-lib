# CLAUDE.md

Working notes for `pxlpacket` — a small TypeScript library that
publishes shared Zod schemas, derived TS types, and (eventually)
runtime utilities for the pxl-packet apps.

This repo is **a library, not an application**. There is no Next.js,
no Drizzle, no shadcn/ui, no Tailwind, no database, and no `.env`. If
you're tempted to reach for any of those, you're in the wrong repo.

## Layout

```
src/
  index.ts        public entry — re-exports types and schemas
  schemas/        all zod schemas, single index.ts
  types/          types derived from schemas via z.infer
  client/         placeholder for browser-only utilities (empty)
dist/             generated build output, published to npm
```

The published package exposes a single entry point (`pxlpacket`).
Both ESM (`dist/index.js`) and CJS (`dist/index.cjs`) are emitted,
with one rolled-up `dist/index.d.ts`.

## Toolchain

- **Package manager**: pnpm `10.11.0`, pinned via the
  `packageManager` field. Don't use npm or yarn — the lockfile is
  pnpm's.
- **Node**: `>=20.19`. `.node-version` pins `20.19.5`.
- **TypeScript**: strict, `module: ESNext`, `moduleResolution:
  Bundler`, `verbatimModuleSyntax: true`. Type-only imports must use
  `import type { ... }` or the build will fail.
- **Build**: `tsdown` emits the JS bundles; `tsc -p
  tsconfig.build.json` plus `dts-bundle-generator` emits the rolled
  `.d.ts`. Run `pnpm build`.
- **Tests**: vitest with globals on. Node env by default;
  `happy-dom` is auto-applied to anything under `src/client/**` and
  any `*.dom.test.ts` file. Run `pnpm test:unit`.
- **Lint/format**: Biome 2.1.4. Run `pnpm lint` /
  `pnpm lint:fix`. Biome's `organizeImports` is **off** on purpose —
  don't auto-reorder imports.
- **Typecheck**: `pnpm typecheck` (`tsc --noEmit`).

## Code conventions

### Formatting (enforced by `biome.json`)

- 80-char line width
- 2-space indent, LF line endings
- Single quotes for JS, double quotes for JSX attributes
- Semicolons always, trailing commas everywhere
- Always use parens around arrow params

### Imports

- Use `import type { X } from '...'` for type-only imports — required
  by `verbatimModuleSyntax`.
- Single quotes on module paths.
- Don't auto-organize imports — Biome's organizer is disabled.

### Zod schemas (`src/schemas/index.ts`)

Almost the entire library is Zod schemas, so the patterns here
matter:

- **Naming**: every schema is suffixed `Z` — `ContainersZ`,
  `TemplateInputZ`, `PxlPacketPayloadZ`. The matching TS type drops
  the `Z` (`Container`, `TemplateInput`, `PxlPacketPayload`).
- **One file, sectioned by banner comments**:

  ```ts
  /** ----------------------------------
   * FFMPEG Template / compiler schema
   * ----------------------------------- */
  ```

  Group new schemas under the right banner instead of starting new
  files unless a section gets genuinely unwieldy.
- **Zod 4 only**. Peer dep is `^4.0.16`. Use the v4 surface:
  `z.url()`, `z.uuid()`, the two-arg `z.record(keySchema,
  valueSchema)`, `z.enum([...])`, `z.tuple([...])`, etc.
- **Defaults live on the schema**. Prefer `.default(...)` on optional
  fields over re-deriving defaults at call sites.
- **Derive, don't duplicate**. When a schema is "this one minus a
  couple fields", use `.omit(...)` (see `TemplateBodyZ` deriving from
  `TemplateInputZ`). When you only need the type-level omission, do
  it in `types/index.ts` with `Omit<...>` (see `TemplateBody`).
- **Recursive schemas**: follow the `JsonValue` pattern — declare
  the TS type by hand, then assert `export const FooZ: z.ZodType<Foo>
  = z.lazy(() => ...)`. `z.lazy` alone won't infer the recursion.
- **Cross-field validation**: use `.refine(...)` with a `message`
  and (when it makes sense) a `path` so callers get useful errors —
  see `VideoRateControlZ` and the `eq` filter in `FilterSpecZ`.

### Types (`src/types/index.ts`)

- Always derive from the schema: `export type Container =
  z.infer<typeof ContainersZ>`. Don't define a parallel TS type for
  anything that already has a schema.
- Mirror the same banner-comment section layout used in `schemas/`.

### Public surface (`src/index.ts`)

- This file *is* the published API. Anything not re-exported here is
  effectively private.
- Keep types and values in two separate blocks: `export type { ...
  } from './types'` for types, plain `export { ... } from
  './schemas'` for the runtime schemas.
- When you add a schema or type, add it to both its source file
  **and** the matching list in `src/index.ts`. Forgetting the
  re-export is the most common bug here.

### `src/client/`

`src/client/index.ts` is intentionally empty. It exists so:

1. Tests under `src/client/**` get a `happy-dom` environment
   automatically (see `vitest.config.ts`).
2. Browser-only helpers can land there later without restructuring.

If you add browser-only code, keep it under `src/client/` so the
test-env matcher keeps working.

### Build externals

`tsdown.config.ts` marks `node:path`, `node:fs`, `node:url`, and
`node:os` as external so they aren't bundled. If you import another
`node:*` builtin, add it to the `external` list.

## Common tasks

- **Add a schema**: edit `src/schemas/index.ts` under the right
  banner, derive the type in `src/types/index.ts`, and re-export
  both from `src/index.ts`.
- **Add a test**: drop `foo.test.ts` next to the source. Use
  `*.dom.test.ts` if you need DOM globals; otherwise the Node env is
  fine.
- **Pre-flight before pushing**: `pnpm lint && pnpm typecheck &&
  pnpm test:unit`.
- **Ship a release**: bump `version` in `package.json`, `git tag
  vX.Y.Z`, `git push && git push --tags`, then `pnpm publish
  --access public`. `prepublishOnly` runs typecheck + clean + build,
  so the published artifact is always freshly built.

## Things to leave alone

- `dist/` — generated, never hand-edit.
- `pnpm-lock.yaml` — let pnpm manage it.
- The two-stage `.d.ts` flow (`tsc` + `dts-bundle-generator`).
  `tsdown`'s built-in dts emission was unstable here, which is why
  `dts: false` is set in `tsdown.config.ts`. Don't flip it back.
- Biome's disabled `organizeImports` — leaving import order to
  humans is intentional.
- The commented-out `resolve.alias` block in `vitest.config.ts` —
  tests use relative imports today; don't enable the alias unless
  you also migrate the tests.
