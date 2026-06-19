import type { Preview } from "@storybook/react-vite";
import "../src/styles/tokens.css";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "space",
      values: [{ name: "space", value: "#0a0b10" }],
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          "Primitives",
          "Surfaces",
          "Composites",
        ],
      },
    },
  },
};

export default preview;
