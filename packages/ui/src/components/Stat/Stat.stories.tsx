import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stat } from "./Stat";

const meta: Meta<typeof Stat> = {
  title: "Primitives/Stat",
  component: Stat,
};

export default meta;
type Story = StoryObj<typeof Stat>;

export const WithUnit: Story = {
  args: { label: "Frame rate", value: 60, unit: "fps" },
};

export const Bare: Story = { args: { label: "Bodies", value: 9 } };
