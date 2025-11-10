import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/builderscore": {
        target: "https://www.builderscore.xyz",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/builderscore/, "/api"),
      },
    },
  },
});
