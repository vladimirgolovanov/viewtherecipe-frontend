import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 5174,
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:11456',
      '/mcp': 'http://localhost:11456',
    },
  },
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
})
