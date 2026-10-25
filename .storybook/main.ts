import type { StorybookConfig } from "@storybook/react-vite";

// story は各コンポーネントの隣の stories.tsx に置く（code-lint/use-stories-file が強制する）。
// vite の設定は vite.config.ts を読み込むため、MSW の vite プラグインもそのまま効く
const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/stories.tsx"],
};

export default config;
