import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chevron } from "./Chevron";

const meta: Meta<typeof Chevron> = {
  title: "Primitives/Chevron",
  component: Chevron,
  args: { open: false, size: 20 },
};

export default meta;
type Story = StoryObj<typeof Chevron>;

export const Collapsed: Story = {};
export const Expanded: Story = { args: { open: true } };
