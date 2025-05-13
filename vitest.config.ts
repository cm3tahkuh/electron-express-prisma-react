import { defineConfig } from "vitest/config";
import path from "path";

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
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/frontend/tests/setup.ts",
  },
});
