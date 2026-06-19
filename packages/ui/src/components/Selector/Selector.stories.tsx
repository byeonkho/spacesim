import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Selector } from "./Selector";

const meta: Meta = {
  title: "Primitives/Selector",
};

export default meta;
type Story = StoryObj;

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

export const Default: Story = {
  render: () => {
    const [v, setV] = useState<string | null>("earth");
    return (
      <Selector
        value={v}
        onChange={setV}
        items={[
          { value: "earth", label: "Earth", leading: dot("var(--color-body-earth)") },
          { value: "mars", label: "Mars", leading: dot("var(--color-body-mars)") },
          {
            value: "jupiter",
            label: "Jupiter",
            leading: dot("var(--color-body-jupiter)"),
          },
        ]}
      />
    );
  },
};
