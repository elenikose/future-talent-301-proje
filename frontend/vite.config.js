import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Uyarıyı susturmak yerine limitleri esnetiyoruz
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        // Büyük kütüphaneleri manuel olarak parçalara ayır
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
