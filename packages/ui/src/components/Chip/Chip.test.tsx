import { render, screen, fireEvent } from "@testing-library/react";
import { Chip } from "./Chip";

test("renders static text when no onClick is given", () => {
  render(<Chip>Earth</Chip>);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.getByText("Earth")).toBeInTheDocument();
});

test("becomes an interactive button when onClick is given", () => {
  const onClick = vi.fn();
  render(
    <Chip onClick={onClick} selected>
      Mars
    </Chip>,
  );
  const btn = screen.getByRole("button", { name: "Mars" });
  expect(btn).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(btn);
  expect(onClick).toHaveBeenCalledOnce();
});
