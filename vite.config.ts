import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: process.env.VITE_BUILD_MODE === 'lib' ? {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BitezEditor',
      fileName: 'bitez-editor',
      formats: ['es', 'umd']
    } : undefined,
    rollupOptions: {
      external: process.env.VITE_BUILD_MODE === 'lib' ? ['react', 'react-dom', 'lucide-react'] : [],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'lucide-react': 'Lucide'
        }
      }
    }
  }
})
