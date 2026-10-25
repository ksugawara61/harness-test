import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TextField } from "./index.tsx";

const meta = {
  args: {
    label: "やること",
    onChange: fn(),
    placeholder: "牛乳を買う",
    value: "",
  },
  component: TextField,
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = {
  args: { value: "牛乳を買う" },
};

export const Disabled: Story = {
  args: { disabled: true, value: "牛乳を買う" },
};
