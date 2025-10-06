import { defineConfig } from 'tsdown';

export default defineConfig({
  // Multiple entries become subpath exports (see package.json)
  entry: ['src/index.ts'],
  dts: false, // declarations emitted via tsc for stable paths
  format: ['esm', 'cjs'], // emit both
  target: 'es2022', // modern JS; safe for Next 14/15+
  platform: 'neutral', // library default; avoids bundling node/browser shims
  clean: true, // wipe dist before build
  sourcemap: true,
  hash: false, // keep output filenames stable
  unbundle: true, // emit per-source modules (matches .d.ts layout)
  external: ['node:path', 'node:fs', 'node:url', 'node:os'], // don't bundle node built-ins add as needed
});
