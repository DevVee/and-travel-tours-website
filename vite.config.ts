import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':           path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@sections':   path.resolve(__dirname, './src/components/sections'),
      '@ui':         path.resolve(__dirname, './src/components/ui'),
      '@layout':     path.resolve(__dirname, './src/components/layout'),
      '@hooks':      path.resolve(__dirname, './src/hooks'),
      '@lib':        path.resolve(__dirname, './src/lib'),
      '@data':       path.resolve(__dirname, './src/data'),
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,            // No source maps in production (hides code structure)
    modulePreload: { polyfill: false }, // Disable inline-script polyfill — required for strict CSP (script-src 'self')
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react-vendor'
          if (id.includes('node_modules/framer-motion')) return 'motion-vendor'
          if (id.includes('node_modules/lucide-react')) return 'icons-vendor'
          if (id.includes('node_modules/qrcode.react')) return 'qr-vendor'
          if (id.includes('node_modules/@fontsource')) return 'fonts-vendor'
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge', 'qrcode.react'],
  },
})
