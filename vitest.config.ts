import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use Node by default (good for your server/ utils code)
    environment: 'node',
    // Switch to a DOM env for certain files/dirs automatically
    environmentMatchGlobs: [
      // anything in src/client/** runs with a DOM
      ['src/client/**', 'happy-dom'],
      // or name a test *.dom.test.ts to force DOM
      ['**/*.dom.test.ts', 'happy-dom'],
    ],

    include: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'tests/**/*.test.ts'],
    exclude: ['dist', 'node_modules'],

    // So you can write describe/it/expect without imports
    globals: true,

    // Use our test tsconfig (gives vitest/globals types)
    // (Vitest auto-detects tsconfig; this keeps it explicit)
    environmentOptions: {},
    // @ts-ignore - vitest accepts this key at runtime
    poolOptions: {},

    // Coverage (v8 is fastest and works well with ESM)
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['**/*.test.*', '**/*.spec.*', 'dist/**'],
    },
  },

  // If you want tests to import your package name (optional):
  // You can map "pxlpacket" subpaths to src so tests don't need a build.
  // Comment out if you just use relative imports in tests.
  // resolve: {
  //   alias: [
  //     { find: /^pxlpacket$/, replacement: new URL('./src/index.ts', import.meta.url).pathname },
  //     { find: /^pxlpacket\/schemas$/, replacement: new URL('./src/schemas/index.ts', import.meta.url).pathname },
  //     { find: /^pxlpacket\/client$/, replacement: new URL('./src/client/index.ts', import.meta.url).pathname },
  //     { find: /^pxlpacket\/server$/, replacement: new URL('./src/server/index.ts', import.meta.url).pathname },
  //   ]
  // },
});
