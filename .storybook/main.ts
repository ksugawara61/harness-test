import type { StorybookConfig } from "@storybook/react-native-web-vite";
import { mergeConfig } from "vite";

// story は各コンポーネントの隣の stories.tsx に置く（code-lint/use-stories-file が強制する）。
// @storybook/react-native-web-vite が react-native を react-native-web で描画する。
// vite の設定は vite.config.ts を読み込むため、MSW の vite プラグインもそのまま効く
const config: StorybookConfig = {
  framework: "@storybook/react-native-web-vite",
  stories: ["../src/**/stories.tsx"],
  // Expo がビルド時に埋め込む環境変数を、ブラウザでも読めるようにする。
  // story は preview.tsx の MSW で fetch を差し替えるため、apiFetch のモックは切っておく
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      define: {
        "process.env.EXPO_PUBLIC_API_MOCK": "undefined",
        "process.env.EXPO_PUBLIC_API_URL": "undefined",
      },
    }),
};

export default config;
