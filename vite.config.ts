import react from "@vitejs/plugin-react";
import { msw } from "msw/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), msw()],
  test: {
    environment: "jsdom",
    include: ["src/**/test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
    setupFiles: ["src/test-utils/setup.ts"],
  },
});
