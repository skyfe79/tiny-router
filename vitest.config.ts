import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.{ts,mts,cts,tsx}'],
    exclude: ['tests/**/*.test.cjs'],
    watch: false,
  },
}); 