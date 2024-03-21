import Inspect from "vite-plugin-inspect";
import { uniappRoutes } from "vite-plugin-uniapp-routes";

export default {
  plugins: [
    uniappRoutes(),
    Inspect({
      build: true,
      outputDir: ".vite-inspect",
    }),
  ],
};
