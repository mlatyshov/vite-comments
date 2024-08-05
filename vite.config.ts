import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'data': '/src/data',
      'lib': '/src/lib',
      'assets': '/src/assets',
      'types': '/src/types'
    }
  }
});
