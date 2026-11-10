import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const dsRoot = fileURLToPath(new URL('../euvinopro-ds', import.meta.url));

export default defineConfig({
  plugins: [react()],
  // @euvino/ds is linked from ../euvinopro-ds and ships TypeScript source.
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { fs: { allow: ['.', dsRoot] } },
});
