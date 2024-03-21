export interface VitePluginUniappRoutesOptions {}

export function uniappRoutes(options?: VitePluginUniappRoutesOptions) {
  console.log(2);
  return {
    name: "vite-plugin-uniapp-routes",
    load(id) {},
  };
}
