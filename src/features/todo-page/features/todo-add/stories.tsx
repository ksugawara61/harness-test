import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { userEvent } from "storybook/test";
import { TodoAdd } from "./index.tsx";
import { TodoAddMocks } from "./mocks.ts";

const meta = {
  component: TodoAdd,
} satisfies Meta<typeof TodoAdd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  parameters: { msw: { handlers: TodoAddMocks.Success } },
};

// 送信に失敗した後の表示は操作しないと出ないため、play で送信まで進める
export const Failure: Story = {
  parameters: { msw: { handlers: TodoAddMocks.Error } },
  play: async ({ canvas }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "やること" }),
      "牛乳を買う",
    );
    await userEvent.click(canvas.getByRole("button", { name: "追加" }));
    await canvas.findByRole("alert");
  },
};
