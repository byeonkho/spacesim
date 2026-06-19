import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

test("renders the title and each stat", () => {
  render(
    <Card
      title="Earth"
      stats={[
        { label: "Mass", value: "5.97e24", unit: "kg" },
        { label: "Moons", value: 1 },
      ]}
    />,
  );
  expect(screen.getByText("Earth")).toBeInTheDocument();
  expect(screen.getByText("Mass")).toBeInTheDocument();
  expect(screen.getByText("5.97e24")).toBeInTheDocument();
  expect(screen.getByText("Moons")).toBeInTheDocument();
});

test("renders the portrait when given", () => {
  render(<Card title="Earth" portrait={{ color: "var(--color-body-earth)" }} />);
  expect(screen.getByRole("img", { name: "Earth" })).toBeInTheDocument();
});
