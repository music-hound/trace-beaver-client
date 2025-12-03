import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Trace Beaver',
        short_name: 'TraceBeaver',
        start_url: '.',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        description: 'Convert raster R&D lab logos to clean SVG vectors',
        icons: [
          {
            src: 'icon.svg',
            sizes: '128x128',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()]
    }
  },
  server: {
    port: 5173
  }
});
