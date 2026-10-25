import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";
import { userEvent } from "storybook/test";
import { buildTodo } from "@/test-utils/factories.ts";
import { TodoItem } from "./index.tsx";
import { TodoItemMocks } from "./mocks.ts";

const meta = {
  args: { todo: buildTodo({ id: "todo-1", title: "牛乳を買う" }) },
  component: TodoItem,
  // TodoItem は一覧の 1 行のため、一覧（role="list"）の中に描画する
  decorators: [
    (Story) => (
      <View role="list">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TodoItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Active: Story = {};

export const Completed: Story = {
  args: {
    todo: buildTodo({ completed: true, id: "todo-1", title: "ゴミを出す" }),
  },
};

// 更新に失敗した後の表示は操作しないと出ないため、play で完了を切り替える
export const Failure: Story = {
  parameters: { msw: { handlers: TodoItemMocks.Error } },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("checkbox", { name: "牛乳を買う" }));
    await canvas.findByRole("alert");
  },
};
