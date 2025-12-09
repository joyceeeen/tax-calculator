import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@tax-calc": path.resolve(__dirname, "../packages/tax-calc"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
});
