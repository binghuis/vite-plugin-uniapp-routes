import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  outDir: "lib",
  sourcemap: false,
  clean: true,
  dts: true,
  format: ["esm"],
  treeshake: true,
});
