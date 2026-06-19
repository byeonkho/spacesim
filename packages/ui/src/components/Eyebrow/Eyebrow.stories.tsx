import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eyebrow } from "./Eyebrow";

const meta: Meta<typeof Eyebrow> = {
  title: "Primitives/Eyebrow",
  component: Eyebrow,
};

export default meta;

type Story = StoryObj<typeof Eyebrow>;

export const Default: Story = {
  args: { children: "Telemetry" },
};
