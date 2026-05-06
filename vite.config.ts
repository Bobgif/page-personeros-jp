import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Eliminamos la importación manual de presets para simplificar
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // 1. El motor de React (Vite ya maneja el compilador si elegiste la opción al crear el proyecto)
    react(), 
    // 2. El motor de diseño de Tailwind v4.2
    tailwindcss(),
  ],
})