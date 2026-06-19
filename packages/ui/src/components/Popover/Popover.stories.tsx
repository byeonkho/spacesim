import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./Popover";

const meta: Meta<typeof Popover> = {
  title: "Surfaces/Popover",
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: "About this run",
    children: (
      <div style={{ display: "grid", gap: 6 }}>
        <strong style={{ color: "var(--color-hi)" }}>Default scenario</strong>
        <span>
          The inner solar system seeded from real ephemeris data, integrated
          forward in time.
        </span>
      </div>
    ),
  },
};
