import { resolve } from "node:path";
import { SpecCoverageReporter } from "@ksugawara61/spec/reporter";
import react from "@vitejs/plugin-react";
import { msw } from "msw/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), msw()],
  test: {
    environment: "jsdom",
    include: ["src/**/test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
    reporters: [
      "default",
      new SpecCoverageReporter({
        featuresDir: resolve(import.meta.dirname, "src/features"),
        mode: "full",
        outputFile: resolve(import.meta.dirname, "coverage/spec-coverage.json"),
      }),
    ],
    setupFiles: ["src/test-utils/setup.ts"],
  },
});
