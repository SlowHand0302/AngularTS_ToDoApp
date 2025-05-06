import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@carbon/icons'],
    include: [],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    commonjsOptions: {
      include: []
    }
  },
  server: {
    fs: {
      // Allow serving files from node_modules
      allow: ['node_modules']
    }
  }
});