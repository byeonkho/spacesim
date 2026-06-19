import { render, screen, fireEvent } from "@testing-library/react";
import { Popover } from "./Popover";

test("body is absent until the trigger is clicked", () => {
  render(<Popover trigger="Open">Popover body</Popover>);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("dialog")).toHaveTextContent("Popover body");
});

test("Escape closes the popover", () => {
  render(<Popover trigger="Open">Popover body</Popover>);
  fireEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("outside mousedown closes the popover", () => {
  render(<Popover trigger="Open">Popover body</Popover>);
  fireEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  fireEvent.mouseDown(document.body);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
