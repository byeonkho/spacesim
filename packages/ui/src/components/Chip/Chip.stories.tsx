import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Primitives/Chip",
  component: Chip,
};

export default meta;
type Story = StoryObj<typeof Chip>;

const dot = (color: string) => (
  <span
    style={{
      width: 8,
      height: 8,
      borderRadius: "9999px",
      background: color,
      display: "inline-block",
    }}
  />
);

export const Static: Story = { args: { children: "Read only" } };

export const Selectable: Story = {
  args: { children: "Mars", onClick: () => {}, leading: dot("var(--color-body-mars)") },
};

export const Selected: Story = {
  args: {
    children: "Earth",
    selected: true,
    onClick: () => {},
    leading: dot("var(--color-body-earth)"),
  },
};
