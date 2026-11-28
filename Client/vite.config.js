import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
    proxy:{
      "/api": {
        target: 'http://localhost:5000',
        secure:false,
      }
    }
  },
  plugins: [react(), 
    tailwindcss()
  ],
})
