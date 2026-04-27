import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://habit-tracker-t0o0.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
