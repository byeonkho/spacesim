import { render, screen, fireEvent } from "@testing-library/react";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { value: "orbit", label: "Orbit" },
  { value: "free", label: "Free" },
];

test("marks the active option pressed", () => {
  render(
    <SegmentedControl
      options={options}
      value="orbit"
      onChange={() => {}}
      label="View"
    />,
  );
  expect(screen.getByRole("button", { name: "Orbit" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("button", { name: "Free" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("calls onChange with the clicked option's value", () => {
  const onChange = vi.fn();
  render(
    <SegmentedControl
      options={options}
      value="orbit"
      onChange={onChange}
      label="View"
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Free" }));
  expect(onChange).toHaveBeenCalledWith("free");
});
