import { render, screen } from "@testing-library/react";
import { Eyebrow } from "./Eyebrow";

test("renders its children", () => {
  render(<Eyebrow>Telemetry</Eyebrow>);
  expect(screen.getByText("Telemetry")).toBeInTheDocument();
});

test("merges a custom className alongside its own", () => {
  render(<Eyebrow className="extra">Live</Eyebrow>);
  const el = screen.getByText("Live");
  expect(el).toHaveClass("extra");
  // its own module class is also present (more than one class total)
  expect(el.className.split(" ").length).toBeGreaterThan(1);
});
