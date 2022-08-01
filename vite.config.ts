import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sharp from './src/sharp/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sharp()],
  build: {
    minify: false,
  },
  // ssr: {
  //   target: 'webworker',
  //   noExternal: true
  // }

})
