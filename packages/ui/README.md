# @nbodysim/ui

The nbodysim design-system component library. Presentation-only React
components styled with CSS Modules that read from exported design tokens.
No Tailwind dependency.

This package is a standalone showcase and the source for the
claude.ai/design sync. It is not consumed by the nbodysim app.

## Scripts

- `npm run build` builds the library to `dist/` (ESM + types + `styles.css`).
- `npm test` runs the component tests.
- `npm run storybook` runs the Storybook showcase on port 6007.
- `npm run build-storybook` builds the static Storybook.

## Usage

```tsx
import { Eyebrow } from "@nbodysim/ui";
import "@nbodysim/ui/styles.css";

export function Example() {
  return <Eyebrow>Telemetry</Eyebrow>;
}
```
