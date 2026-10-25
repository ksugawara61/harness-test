import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { TodoError } from "./index.tsx";

const meta = {
  component: TodoError,
} satisfies Meta<typeof TodoError>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "やることを追加できませんでした" },
};
