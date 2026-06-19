import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

test("renders children and fires onClick", () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Run</Button>);
  fireEvent.click(screen.getByRole("button", { name: "Run" }));
  expect(onClick).toHaveBeenCalledOnce();
});

test("applies the ghost variant class", () => {
  render(<Button variant="ghost">Ghost</Button>);
  expect(screen.getByRole("button", { name: "Ghost" }).className).toMatch(/ghost/);
});

test("forwards disabled to the button element", () => {
  render(<Button disabled>Nope</Button>);
  expect(screen.getByRole("button", { name: "Nope" })).toBeDisabled();
});
