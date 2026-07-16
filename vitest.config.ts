import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/lib/**/*.test.ts']
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
});
