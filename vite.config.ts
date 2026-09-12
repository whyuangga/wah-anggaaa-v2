import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Base adaptif per platform:
    // - Vercel (root domain)        → '/'
    // - GitHub Pages (repo v2)      → '/wah-anggaaa-v2/' (via PAGES_DEPLOY di workflow)
    // - dev lokal                   → '/wah-anggaaa/' (dipakai suite e2e bawaan)
    // Router basename di App.tsx otomatis mengikuti via BASE_URL.
    base: process.env.VERCEL
      ? '/'
      : process.env.PAGES_DEPLOY
        ? '/wah-anggaaa-v2/'
        : '/wah-anggaaa/',
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // vendor terpisah → cache jangka panjang, initial load lebih ringan
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-motion': ['motion'],
            'vendor-gsap': ['gsap'],
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: true as true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
