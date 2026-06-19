import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoTooltip } from "./InfoTooltip";

const meta: Meta<typeof InfoTooltip> = {
  title: "Primitives/InfoTooltip",
  component: InfoTooltip,
  args: {
    label: "What is reality drift?",
    children:
      "How far the simulation has wandered from the real ephemeris over time.",
  },
};

export default meta;
type Story = StoryObj<typeof InfoTooltip>;

export const Default: Story = {
  render: (args) => (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: "var(--color-hi)",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
      }}
    >
      <span>Reality drift</span>
      <InfoTooltip {...args} />
    </div>
  ),
};
