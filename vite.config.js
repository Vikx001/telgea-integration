import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/web',            // <-- tells Vite where index.html lives
  build: {
    outDir: '../../web-dist', // keeps build outside src/web
    emptyOutDir: true
  }
});
