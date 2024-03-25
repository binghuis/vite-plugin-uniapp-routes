import { readFileSync, writeFileSync, accessSync, constants } from "fs";
import path from "node:path";

export interface VitePluginUniappRoutesOptions {
  dir?: string;
}

interface PagesJsonPages {
  path: string;
  style: {
    navigationBarTitleText: string;
  };
}

interface PagesJson {
  pages: PagesJsonPages[];
}

interface RouteInfo {
  path: string;
  name: string;
}

function generateTsCode(json: PagesJson) {
  const routes: Record<string, RouteInfo> = {};

  for (const { path, style } of json.pages) {
    const key = getPageKey(path);
    routes[key] = {
      path: `/${path}`,
      name: style.navigationBarTitleText,
    };
  }

  const routeKeys = Object.keys(routes);

  if (routeKeys.length === 0) {
    return "";
  }

  const tsCode =
    `/* eslint-disable */\n` +
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
  const paths = pagePath.replace(/^(pages\/)|-/g, "");

  return paths
    .split("/")
    .map((item) => {
      return item[0]?.toLocaleUpperCase() + item.slice(1);
    })
    .join("");
}

function fileExists(filePath: string) {
  try {
    accessSync(filePath, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

const uniappRoutes = (option?: VitePluginUniappRoutesOptions) => {
  const { dir = "src" } = option ?? {};
  const tsFilePath = path.join(dir, "/routes.ts");

  return {
    name: "vite-plugin-uniapp-routes",
    buildStart: () => {
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
