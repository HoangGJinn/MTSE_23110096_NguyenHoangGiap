import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@apollo/client',
      '@apollo/client/react',
      '@apollo/client/link/context',
      'graphql'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  resolve: {
    dedupe: ['@apollo/client', 'graphql']
  }
})
