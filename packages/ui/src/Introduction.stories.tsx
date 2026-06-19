import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Introduction/Overview",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li style={{ marginBottom: 8, color: "var(--color-text)" }}>{children}</li>
);

const Tier = ({ name, items }: { name: string; items: string }) => (
  <div style={{ marginBottom: 14 }}>
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--color-subdim)",
        marginBottom: 4,
      }}
    >
      {name}
    </div>
    <div style={{ color: "var(--color-hi)", fontSize: 14 }}>{items}</div>
  </div>
);

export const Overview: Story = {
  render: () => (
    <div
      style={{
        padding: 40,
        maxWidth: 720,
        background: "var(--color-bg)",
        color: "var(--color-hi)",
        fontFamily: "var(--font-sans)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          marginBottom: 10,
        }}
      >
        nbodysim design system
      </div>
      <h1 style={{ fontSize: 32, margin: "0 0 16px", color: "var(--color-hi)" }}>
        The nbodysim UI kit
      </h1>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: "var(--color-text)",
          margin: "0 0 28px",
        }}
      >
        The dark glass interface from nbodysim, packaged as standalone,
        presentation-only React components. This catalog is both a showcase and
        the source for the claude.ai/design sync, so designs built there are
        made of the real parts. The components are not consumed by the app
        itself; they are a clean, decoupled library.
      </p>

      <h2 style={{ fontSize: 16, color: "var(--color-hi)", margin: "0 0 10px" }}>
        How it is built
      </h2>
      <ul style={{ paddingLeft: 18, margin: "0 0 28px", lineHeight: 1.5 }}>
        <Bullet>
          No Tailwind. Each component carries scoped CSS Modules that read from
          exported design tokens.
        </Bullet>
        <Bullet>
          Tokens are plain CSS custom properties (<code>var(--color-accent)</code>
          , <code>var(--radius-panel)</code>, and so on). Compose components via
          props and use the tokens for your own layout glue.
        </Bullet>
        <Bullet>
          Every component is accessible (correct roles and labels) and respects
          reduced-motion preferences.
        </Bullet>
        <Bullet>React-only: zero runtime dependencies.</Bullet>
      </ul>

      <h2 style={{ fontSize: 16, color: "var(--color-hi)", margin: "0 0 12px" }}>
        What is inside
      </h2>
      <Tier
        name="Primitives"
        items="Button, Toggle, InfoTooltip, Chip, Chevron, Disclosure, Stat, Eyebrow, SegmentedControl, Selector"
      />
      <Tier name="Surfaces" items="GlassPanel, Popover" />
      <Tier name="Composites" items="Card, CelestialPortrait" />
      <Tier name="Foundations" items="Color, radii, and type tokens" />
    </div>
  ),
};
