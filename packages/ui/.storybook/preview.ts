import type { Preview } from "@storybook/react-vite";
import "../src/styles/tokens.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "space",
      values: [{ name: "space", value: "#0a0b10" }],
    },
  },
};

export default preview;
