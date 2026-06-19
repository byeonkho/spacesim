import type { Meta, StoryObj } from "@storybook/react-vite";
import { Disclosure } from "./Disclosure";

const meta: Meta<typeof Disclosure> = {
  title: "Primitives/Disclosure",
  component: Disclosure,
  args: {
    title: "Advanced settings",
    children: "Step size, trail length, and other expert controls.",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Disclosure>;

export const Collapsed: Story = {};
export const Expanded: Story = { args: { defaultOpen: true } };
