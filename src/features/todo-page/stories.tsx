import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { TodoPage } from "./index.tsx";
import { TodoPageMocks } from "./mocks.ts";

const meta = {
  component: TodoPage,
} satisfies Meta<typeof TodoPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  parameters: { msw: { handlers: TodoPageMocks.Success } },
};

export const Empty: Story = {
  parameters: { msw: { handlers: TodoPageMocks.Empty } },
};
