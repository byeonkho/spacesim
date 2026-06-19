import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Toggle, type ToggleState } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Primitives/Toggle",
  component: Toggle,
  args: { label: "Trails" },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Off: Story = { args: { state: "off" } };
export const Mixed: Story = { args: { state: "mixed" } };
export const On: Story = { args: { state: "on" } };

export const Interactive: Story = {
  render: (args) => {
    const [state, setState] = useState<ToggleState>("off");
    return <Toggle {...args} state={state} onChange={setState} />;
  },
};
