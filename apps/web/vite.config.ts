import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    manifest: true
  },
  plugins: [react()],
  server: {
    port: 5173
  }
});
