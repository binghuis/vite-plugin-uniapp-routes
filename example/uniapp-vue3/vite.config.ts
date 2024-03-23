import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { uniappRoutes } from "vite-plugin-uniapp-routes";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uniappRoutes(), uni()],
});
