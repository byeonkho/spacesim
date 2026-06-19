import { render, screen } from "@testing-library/react";
import { Stat } from "./Stat";

test("renders the label and value", () => {
  render(<Stat label="Frame rate" value={60} />);
  expect(screen.getByText("Frame rate")).toBeInTheDocument();
  expect(screen.getByText("60")).toBeInTheDocument();
});

test("renders the unit when provided", () => {
  render(<Stat label="Speed" value={1.5} unit="AU/day" />);
  expect(screen.getByText("AU/day")).toBeInTheDocument();
});

test("the value uses the tabular value styling", () => {
  render(<Stat label="Bodies" value={9} />);
  expect(screen.getByText("9").className).toMatch(/value/);
});
