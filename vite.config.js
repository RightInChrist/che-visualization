import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/che-visualization/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          babylon: ['@babylonjs/core'],
          gui: ['@babylonjs/gui'],
          loaders: ['@babylonjs/loaders']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    open: true
  }
}); 