# @nbodysim/ui

The nbodysim design system, packaged as standalone React components: the dark
glass interface from [nbodysim](https://nbodysim.com), as presentation-only,
prop-driven parts.

This package is a showcase (browse it in Storybook) and the source for the
claude.ai/design sync, so designs built there are made of the real components.
It is intentionally **not** consumed by the nbodysim app; it is a clean,
decoupled library.

## Design idiom

- **No Tailwind.** Each component carries scoped CSS Modules that read from
  exported design tokens. Consumers do not need a CSS framework.
- **Tokens are plain CSS custom properties.** Style with `var(--color-accent)`,
  `var(--radius-panel)`, and the rest. Compose components through props and use
  the tokens for your own layout glue.
- **Accessible and motion-aware.** Components use correct roles and labels and
  respect `prefers-reduced-motion`.
- **React-only.** Zero runtime dependencies (React is a peer dependency).

## Getting started

```bash
npm install
npm run build            # build the library to dist/ (ESM + types + styles.css)
npm test                 # run the component tests
npm run storybook        # browse the showcase on port 6007
npm run build-storybook  # build the static showcase
```

## Usage

```tsx
import { Button, Card } from "@nbodysim/ui";
import "@nbodysim/ui/styles.css";

export function Example() {
  return (
    <Card title="Earth" portrait={{ color: "var(--color-body-earth)" }}>
      <Button variant="primary">Focus</Button>
    </Card>
  );
}
```

## Tokens

All design values live in `src/styles/tokens.css` and ship in `styles.css`.

| Family       | Examples                                                        |
| ------------ | --------------------------------------------------------------- |
| Surfaces     | `--color-bg`, `--color-space`                                   |
| Text         | `--color-hi`, `--color-text`, `--color-dim`, `--color-subdim`   |
| Accent/status| `--color-accent`, `--color-amber`, `--color-success`           |
| Body palette | `--color-body-earth`, `--color-body-saturn`, `--color-body-sun` |
| Type         | `--font-sans`, `--font-mono`                                    |
| Radii        | `--radius-panel`, `--radius-strip`, `--radius-chip`, `--radius-dock` |

## Components

**Primitives**

- `Button` action button, primary or ghost, with an optional call-to-action pulse.
- `Toggle` tri-state switch (off, mixed, on).
- `InfoTooltip` info-icon button with a portal tooltip that escapes clipping.
- `Chip` compact pill, static or interactive.
- `Chevron` rotating affordance for collapsible surfaces.
- `Disclosure` self-contained collapsible section.
- `Stat` labeled tabular-numeric readout.
- `Eyebrow` uppercase mono micro-label.
- `SegmentedControl` horizontal single-select control.
- `Selector` vertical single-select list.

**Surfaces**

- `GlassPanel` translucent glass surface, with a bottom-docked variant.
- `Popover` anchored popover with click toggle and dismissal.

**Composites**

- `Card` branded info card with a portrait header and a stat grid.
- `CelestialPortrait` radial-gradient body avatar built from the body palette.
