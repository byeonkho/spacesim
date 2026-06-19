import { render, screen, fireEvent } from "@testing-library/react";
import { Disclosure } from "./Disclosure";

test("content is hidden by default and toggles open on click", () => {
  render(
    <Disclosure title="Details">
      <p>Body</p>
    </Disclosure>,
  );
  const header = screen.getByRole("button", { name: /Details/ });
  expect(header).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByText("Body")).not.toBeInTheDocument();

  fireEvent.click(header);
  expect(header).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText("Body")).toBeInTheDocument();
});

test("defaultOpen shows content initially", () => {
  render(
    <Disclosure title="Details" defaultOpen>
      <p>Body</p>
    </Disclosure>,
  );
  expect(screen.getByText("Body")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Details/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});
