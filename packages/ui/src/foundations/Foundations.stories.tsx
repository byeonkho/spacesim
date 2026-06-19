import type { Meta, StoryObj } from "@storybook/react-vite";

// Foundations is a showcase-only page: it renders the design tokens so the
// language is visible in Storybook and screenshot-able by design-sync. It
// exports no component, only stories.

const SURFACES = ["--color-bg", "--color-space"];
const TEXT = ["--color-text", "--color-hi", "--color-dim", "--color-subdim"];
const ACCENT = [
  "--color-accent",
  "--color-accent-grad-end",
  "--color-amber",
  "--color-success",
];
const BODY = [
  "--color-body-sun",
  "--color-body-mercury",
  "--color-body-venus",
  "--color-body-earth",
  "--color-body-mars",
  "--color-body-jupiter",
  "--color-body-saturn",
  "--color-body-uranus",
  "--color-body-neptune",
  "--color-body-moon",
];
const RADII = ["--radius-strip", "--radius-chip", "--radius-panel", "--radius-dock"];

function Swatch({ token }: { token: string }) {
  return (
    <div style={{ width: 96, fontFamily: "var(--font-mono)", fontSize: 10 }}>
      <div
        style={{
          height: 56,
          borderRadius: 8,
          background: `var(${token})`,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
      <div style={{ marginTop: 6, color: "var(--color-dim)" }}>{token}</div>
    </div>
  );
}

function Group({ name, tokens }: { name: string; tokens: string[] }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h3
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-subdim)",
          margin: "0 0 12px",
        }}
      >
        {name}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {tokens.map((t) => (
          <Swatch key={t} token={t} />
        ))}
      </div>
    </section>
  );
}

const page = (children: React.ReactNode) => (
  <div style={{ padding: 24, background: "var(--color-bg)", color: "var(--color-hi)" }}>
    {children}
  </div>
);

const meta: Meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Colors: Story = {
  render: () =>
    page(
      <>
        <Group name="Surfaces" tokens={SURFACES} />
        <Group name="Text" tokens={TEXT} />
        <Group name="Accent and status" tokens={ACCENT} />
        <Group name="Body palette" tokens={BODY} />
      </>,
    ),
};

export const Radii: Story = {
  render: () =>
    page(
      <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
        {RADII.map((t) => (
          <div key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: `var(${t})`,
                background: "rgba(164,168,255,0.18)",
                border: "1px solid var(--color-accent)",
              }}
            />
            <div style={{ marginTop: 8, color: "var(--color-dim)" }}>{t}</div>
          </div>
        ))}
      </div>,
    ),
};

export const Typography: Story = {
  render: () =>
    page(
      <div style={{ display: "grid", gap: 20 }}>
        <div style={{ fontFamily: "var(--font-sans)" }}>
          <div style={{ color: "var(--color-dim)", fontSize: 11 }}>--font-sans</div>
          <div style={{ fontSize: 28, color: "var(--color-hi)" }}>
            The quick brown fox 0123456789
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-mono)" }}>
          <div style={{ color: "var(--color-dim)", fontSize: 11 }}>--font-mono</div>
          <div
            style={{
              fontSize: 28,
              color: "var(--color-hi)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            The quick brown fox 0123456789
          </div>
        </div>
      </div>,
    ),
};
