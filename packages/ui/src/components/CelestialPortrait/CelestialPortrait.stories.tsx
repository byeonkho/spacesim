import type { Meta, StoryObj } from "@storybook/react-vite";
import { CelestialPortrait } from "./CelestialPortrait";

const meta: Meta<typeof CelestialPortrait> = {
  title: "Composites/CelestialPortrait",
  component: CelestialPortrait,
};

export default meta;
type Story = StoryObj<typeof CelestialPortrait>;

export const Earth: Story = {
  args: { color: "var(--color-body-earth)", label: "Earth", size: 64 },
};

export const Sun: Story = {
  args: { color: "var(--color-body-sun)", label: "Sun", size: 88 },
};

export const Saturn: Story = {
  args: { color: "var(--color-body-saturn)", label: "Saturn", size: 64, ring: true },
};

export const Gallery: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      {[
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "neptune",
      ].map((b) => (
        <CelestialPortrait
          key={b}
          color={`var(--color-body-${b})`}
          label={b}
          size={48}
          ring={b === "saturn"}
        />
      ))}
    </div>
  ),
};
