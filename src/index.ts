import { readFileSync, writeFileSync, accessSync, constants } from "fs";
import { Plugin } from "vite";

interface VitePluginUniappRoutesOptions {
  dir?: string;
}

interface RoutesObj {
  path: string;
  name: string;
}

function generateTsCode(json: any) {
  const routes: Record<string, RoutesObj> = {};

  for (const page of json.pages) {
    const key = getPageKey(page.path);
    routes[key] = {
      path: `/${page.path}`,
      name: page.style.navigationBarTitleText,
    };
  }

  const routeKeys = Object.keys(routes);

  if (!routeKeys || routeKeys.length === 0) {
    return "";
  }

  const tsCode =
    `// eslint-disable\n` +
    `// prettier-ignore\n\n` +
    `export enum RoutesEnum {${routeKeys
      .map((key) => {
        if (!routes[key]) {
          return "";
        }
        return (
          `\n\t/** ${routes[key]?.name} */\n` +
          `\t"${key}" = "${routes[key]?.path}"`
        );
      })
      .join(",")}\n}\n\n` +
    `export type RouteKeyType = ${routeKeys
      .map((key) => `"${key}"`)
      .join(" | ")}\n\n` +
    `export type RoutePathType = ${Object.values(routes)
      .map((value) => `"${value.path}"`)
      .join(" | ")}`;

  return tsCode;
}

function getPageKey(pagePath: string) {
  pagePath = pagePath.replace(/^pages/, "");
  const pattern = /(?<=\/|^)([a-z])/g;
  const key = pagePath.replace(pattern, (match, p1) => p1.toUpperCase());
  return key.replace(/[-/]/g, "");
}

function fileExists(filePath: string) {
  try {
    accessSync(filePath, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

const uniappRoutes = (option: VitePluginUniappRoutesOptions): Plugin => {
  const { dir } = option;
  const tsFilePath = (dir ?? ".") + "/routes.ts";
  return {
    name: "vite-plugin-uniapp-routes",
    buildStart: (curOpt) => {
      const jsonContent = readFileSync("src/pages.json", "utf-8");
      const json = JSON.parse(jsonContent);
      const tsContent = generateTsCode(json);
      let oldContent = "";
      if (fileExists(tsFilePath)) {
        oldContent = readFileSync(tsFilePath, "utf-8");
      }
      if (tsContent != oldContent) {
        writeFileSync(tsFilePath, tsContent);
      }
    },
  };
};

export { uniappRoutes };
