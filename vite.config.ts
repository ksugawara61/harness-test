import { resolve } from "node:path";
import { SpecCoverageReporter } from "@ksugawara61/spec/reporter";
import react from "@vitejs/plugin-react";
import { msw } from "msw/vite";
import { defineConfig } from "vitest/config";

// アプリは Expo（Metro）でビルドし、Vite は Vitest と Storybook だけで使う
export default defineConfig({
  plugins: [react(), msw()],
  resolve: {
    alias: [
      // tsconfig.json の paths と同じく、@/ を src/ に解決する
      { find: "@", replacement: resolve(import.meta.dirname, "src") },
      // Expo の web と同じく、react-native を react-native-web で描画する
      { find: /^react-native$/, replacement: "react-native-web" },
    ],
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
    // graphql は Vite と Node で解決先（development 条件の有無）が分かれ、別のモジュールとして読まれる。
    // @graphql-tools も Vite で解決させ、src と同じ graphql を使わせる
    server: { deps: { inline: [/@graphql-tools\//] } },
    setupFiles: ["src/test-utils/setup.ts"],
  },
});
