import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SegmentedControl } from "./SegmentedControl";

const meta: Meta = {
  title: "Primitives/SegmentedControl",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState("orbit");
    return (
      <SegmentedControl
        label="Camera view"
        value={v}
        onChange={setV}
        options={[
          { value: "orbit", label: "Orbit" },
          { value: "free", label: "Free" },
          { value: "top", label: "Top down" },
        ]}
      />
    );
  },
};
