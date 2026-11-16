import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const emptyModule = fileURLToPath(new URL('./src/lib/empty-module.js', import.meta.url));

export default defineConfig({
  plugins: [react()],

  // Relative base: the same build runs on Vercel (site root) and inside the
  // Electron app, which loads dist/index.html from a file:// path. The app uses
  // HashRouter, so no server-side rewrites are needed either way.
  base: './',

  resolve: {
    alias: {
      // jsPDF's optional .html() renderer dependencies. The bill PDF is drawn
      // with the text API, so these never run; aliasing keeps ~226KB out of the
      // bundle. See src/lib/empty-module.js.
      html2canvas: emptyModule,
      dompurify: emptyModule,
    },
  },

  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Libraries change rarely, the app changes often: keeping them in their
        // own files lets browsers reuse the cached copy after every update.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/](recharts|d3-[^\\/]+|victory-vendor|internmap)[\\/]/.test(id)) return 'charts';
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'react';
          return undefined;
        },
      },
    },
    // Skips gzip-measuring every chunk. Purely a console report, and it is the
    // step that runs out of memory on low-RAM machines.
    reportCompressedSize: false,
  },
});
