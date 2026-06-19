import { render, screen, fireEvent } from "@testing-library/react";
import { InfoTooltip } from "./InfoTooltip";

test("the icon button exposes its aria-label", () => {
  render(<InfoTooltip label="What is this?">Body text</InfoTooltip>);
  expect(
    screen.getByRole("button", { name: "What is this?" }),
  ).toBeInTheDocument();
});

test("renders the tooltip body on focus, not before", () => {
  render(<InfoTooltip label="What is this?">Helpful body</InfoTooltip>);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  fireEvent.focus(screen.getByRole("button", { name: "What is this?" }));
  expect(screen.getByRole("tooltip")).toHaveTextContent("Helpful body");
});
