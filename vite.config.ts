import { resolve } from "node:path";
import { SpecCoverageReporter } from "@ksugawara61/spec/reporter";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { msw } from "msw/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // ルーティングは src/apps のファイルで決め、ルートの木を src/route-tree.gen.ts に生成する。
  // react() より前に置く
  plugins: [
    tanstackRouter({
      generatedRouteTree: "./src/route-tree.gen.ts",
      routesDirectory: "./src/apps",
      target: "react",
    }),
    react(),
    msw(),
  ],
  // tsconfig.json の paths と同じく、@/ を src/ に解決する
  resolve: {
    alias: { "@": resolve(import.meta.dirname, "src") },
  },
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
