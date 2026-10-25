import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Alert } from "./index.tsx";

const meta = {
  args: { children: "やることを読み込めませんでした" },
  component: Alert,
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
