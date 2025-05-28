import type { Preview } from "@storybook/react";

import "@gouvfr/dsfr/dist/dsfr.min.css";
import "@gouvfr/dsfr/dist/utility/utility.min.css";
import "../src/styles/fonts";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      layout: "fullscreen",
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
