import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlassPanel } from "./GlassPanel";

const meta: Meta<typeof GlassPanel> = {
  title: "Surfaces/GlassPanel",
  component: GlassPanel,
  parameters: {
    backgrounds: {
      default: "scene",
      values: [{ name: "scene", value: "#05060f" }],
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassPanel>;

export const Panel: Story = {
  args: {
    children: (
      <div style={{ padding: 20, width: 220, color: "var(--color-hi)" }}>
        Floating glass panel
      </div>
    ),
  },
};

export const Dock: Story = {
  args: {
    variant: "dock",
    children: (
      <div style={{ padding: 20, width: 280, color: "var(--color-hi)" }}>
        Bottom-docked sheet
      </div>
    ),
  },
};
