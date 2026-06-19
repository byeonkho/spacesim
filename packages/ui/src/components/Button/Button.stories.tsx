import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Run simulation" },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Ghost: Story = { args: { variant: "ghost", children: "Reset" } };

export const Pulse: Story = { args: { pulse: true, children: "Start" } };

export const Disabled: Story = { args: { disabled: true } };
