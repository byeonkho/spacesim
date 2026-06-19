import { render, screen } from "@testing-library/react";
import { CelestialPortrait } from "./CelestialPortrait";

test("exposes role img with the label when labeled", () => {
  render(<CelestialPortrait color="var(--color-body-earth)" label="Earth" />);
  expect(screen.getByRole("img", { name: "Earth" })).toBeInTheDocument();
});

test("is decorative (aria-hidden, no img role) without a label", () => {
  const { container } = render(<CelestialPortrait color="#ffffff" />);
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
});
