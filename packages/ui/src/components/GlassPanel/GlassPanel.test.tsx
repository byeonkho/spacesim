import { render, screen } from "@testing-library/react";
import { GlassPanel } from "./GlassPanel";

test("renders children", () => {
  render(<GlassPanel>Contents</GlassPanel>);
  expect(screen.getByText("Contents")).toBeInTheDocument();
});

test("applies the dock variant class", () => {
  render(
    <GlassPanel variant="dock" data-testid="surface">
      x
    </GlassPanel>,
  );
  expect(screen.getByTestId("surface").className).toMatch(/dock/);
});
