import type { Meta, StoryObj } from "@storybook/react-vite";
import { TodoList } from "./index.tsx";
import { TodoListMocks } from "./mocks.ts";

const meta = {
  component: TodoList,
} satisfies Meta<typeof TodoList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  parameters: { msw: { handlers: TodoListMocks.Success } },
};

export const Empty: Story = {
  parameters: { msw: { handlers: TodoListMocks.Empty } },
};

export const Failure: Story = {
  parameters: { msw: { handlers: TodoListMocks.Error } },
};
