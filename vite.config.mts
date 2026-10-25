import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SpecCoverageReporter } from "@ksugawara61/spec/reporter";
import { msw } from "msw/vite";
import { defineConfig } from "vitest/config";

// アプリは Expo（Metro）でビルドし、Vite は Vitest と Storybook だけで使う。
// JSX は Vite が tsconfig.json の jsx（react-jsx）で変換する。
// Storybook は @storybook/react-native-web-vite が React のプラグインを足すため、ここでは足さない
export default defineConfig({
  plugins: [msw()],
  resolve: {
    alias: [
      // tsconfig.json の paths と同じく、@/ を src/ に解決する
      { find: "@", replacement: resolve(import.meta.dirname, "src") },
      // Expo の web と同じく、react-native を react-native-web で描画する
      { find: /^react-native$/, replacement: "react-native-web" },
      // graphql は Vite（development 条件）と Node で別のファイルに解決され、別のモジュールとして読まれる。
      // Node が node_modules の @graphql-tools・graphql-yoga に読ませるのと同じファイルに揃える
      {
        find: /^graphql$/,
        replacement: fileURLToPath(import.meta.resolve("graphql")),
      },
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
    setupFiles: ["src/test-utils/setup.ts"],
  },
});
