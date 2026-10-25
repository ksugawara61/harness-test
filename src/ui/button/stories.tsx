import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./index.tsx";

const meta = {
  args: { children: "追加", onClick: fn(), type: "button" },
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Danger: Story = {
  args: { children: "削除", label: "牛乳を買うを削除", variant: "danger" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
