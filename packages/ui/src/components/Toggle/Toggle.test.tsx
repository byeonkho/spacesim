import { render, screen, fireEvent } from "@testing-library/react";
import { Toggle } from "./Toggle";

test("aria-checked reflects each state", () => {
  const { rerender } = render(<Toggle state="off" label="Trails" />);
  expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  rerender(<Toggle state="on" label="Trails" />);
  expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  rerender(<Toggle state="mixed" label="Trails" />);
  expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "mixed");
});

test("click advances off->on, on->off, mixed->on", () => {
  const onChange = vi.fn();
  const { rerender } = render(
    <Toggle state="off" label="Trails" onChange={onChange} />,
  );
  fireEvent.click(screen.getByRole("switch"));
  expect(onChange).toHaveBeenLastCalledWith("on");

  rerender(<Toggle state="on" label="Trails" onChange={onChange} />);
  fireEvent.click(screen.getByRole("switch"));
  expect(onChange).toHaveBeenLastCalledWith("off");

  rerender(<Toggle state="mixed" label="Trails" onChange={onChange} />);
  fireEvent.click(screen.getByRole("switch"));
  expect(onChange).toHaveBeenLastCalledWith("on");
});

test("exposes the label for accessibility", () => {
  render(<Toggle state="off" label="Trails" />);
  expect(screen.getByRole("switch", { name: "Trails" })).toBeInTheDocument();
});
