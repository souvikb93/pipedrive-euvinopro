import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // @euvino/ds (vendor/euvino-ds) ships TypeScript source and shares React with the app.
  resolve: { dedupe: ['react', 'react-dom'] },
});
