import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Ensures Vite listens on all network interfaces
    port: 5173, // Optional: specifies the port if needed
  }
})
