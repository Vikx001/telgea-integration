// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/web',
  build: {
    outDir: 'dist', 
    emptyOutDir: true
  }
});
