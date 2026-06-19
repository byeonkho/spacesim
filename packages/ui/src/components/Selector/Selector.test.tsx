import { render, screen, fireEvent } from "@testing-library/react";
import { Selector } from "./Selector";

const items = [
  { value: "earth", label: "Earth" },
  { value: "mars", label: "Mars" },
];

test("marks the selected item pressed", () => {
  render(<Selector items={items} value="earth" onChange={() => {}} />);
  expect(screen.getByRole("button", { name: "Earth" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("button", { name: "Mars" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("calls onChange with the clicked item's value", () => {
  const onChange = vi.fn();
  render(<Selector items={items} value="earth" onChange={onChange} />);
  fireEvent.click(screen.getByRole("button", { name: "Mars" }));
  expect(onChange).toHaveBeenCalledWith("mars");
});
