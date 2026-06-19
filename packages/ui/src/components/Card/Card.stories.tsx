import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Composites/Card",
  component: Card,
  parameters: {
    backgrounds: {
      default: "scene",
      values: [{ name: "scene", value: "#05060f" }],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Earth: Story = {
  args: {
    title: "Earth",
    subtitle: "Terrestrial planet",
    portrait: { color: "var(--color-body-earth)" },
    stats: [
      { label: "Mass", value: "5.97e24", unit: "kg" },
      { label: "Moons", value: 1 },
      { label: "Day", value: "23.9", unit: "h" },
      { label: "Gravity", value: "9.81", unit: "m/s2" },
    ],
  },
};

export const Saturn: Story = {
  args: {
    title: "Saturn",
    subtitle: "Gas giant",
    portrait: { color: "var(--color-body-saturn)", ring: true },
    stats: [
      { label: "Moons", value: 146 },
      { label: "Day", value: "10.7", unit: "h" },
    ],
  },
};
