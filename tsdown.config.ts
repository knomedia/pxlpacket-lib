import { defineConfig } from 'tsdown';

export default defineConfig({
  // Multiple entries become subpath exports (see package.json)
  entry: [
    'src/index.ts',
    'src/client/index.ts',
    'src/server/index.ts',
    'src/schemas/index.ts',
    'src/utils/index.ts',
  ],
  dts: { sourcemap: true }, // generate .d.ts (+ maps)
  format: ['esm', 'cjs'], // emit both
  target: 'es2022', // modern JS; safe for Next 14/15+
  platform: 'neutral', // library default; avoids bundling node/browser shims
  clean: true, // wipe dist before build
  sourcemap: true,
  external: ['node:path', 'node:fs', 'node:url', 'node:os'], // don't bundle node built-ins add as needed
});
