import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "clerk-vendor": ["@clerk/clerk-react"],
          "framer-vendor": ["framer-motion"],
          "ui-vendor": [
            "@radix-ui/react-avatar",
            "@radix-ui/react-dialog",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-tabs",
            "lucide-react",
          ],
        },
      },
    },
  },
})

