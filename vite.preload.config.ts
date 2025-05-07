import { defineConfig } from "vite";
import path from "path";
// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      "@styles": path.join(__dirname, "src/frontend/styles"),
      "@pages": path.join(__dirname, "src/frontend/pages"),
      "@widgets": path.join(__dirname, "src/frontend/widgets"),
      "@shared": path.join(__dirname, "src/frontend/shared"),
      "@store": path.join(__dirname, "src/frontend/store"),
      "@api": path.join(__dirname, "src/frontend/api"),
    },
  },
});


