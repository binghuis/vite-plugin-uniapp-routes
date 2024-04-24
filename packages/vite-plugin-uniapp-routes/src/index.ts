import { accessSync, constants, readFileSync, writeFileSync } from "fs";
import path from "node:path";

export interface VitePluginUniappRoutesOptions {
  dir?: string;
  prefix?: string | string[];
}

interface PagesJsonPages {
  path: string;
  style: {
    navigationBarTitleText: string;
  };
}

interface PagesJsonSubPackages {
  root: string;
  pages: PagesJsonPages[];
}

interface PagesJson {
  pages: PagesJsonPages[];
  subPackages?: PagesJsonSubPackages[];
}

interface RouteInfo {
  path: string;
  name: string;
}

function genPageKey(pagePath: string) {
  const paths = pagePath.replace(/^(pages\/)|-/g, "");

  return paths
    .split("/")
    .filter(Boolean)
    .map((item) => {
      return item[0]?.toLocaleUpperCase() + item.slice(1);
    })
    .join("");
}

function genPageObj(
  path: PagesJsonPages["path"],
  style: PagesJsonPages["style"]
) {
  return {
    path: `/${path}`.replace(/\/{2,}/g, "/"),
    name: style.navigationBarTitleText,
  };
}

function genTsCode(json: PagesJson) {
  const routes: Record<string, RouteInfo> = {};
  const { subPackages, pages } = json;

  for (const { path, style } of pages) {
    const key = genPageKey(path);
    routes[key] = genPageObj(path, style);
  }

  subPackages?.forEach((pkg: PagesJsonSubPackages) => {
    for (let { path, style } of pkg.pages) {
      path = pkg.root + "/" + path;
      const key = genPageKey(path);
      routes[key] = genPageObj(path, style);
    }
  });

  const routeKeys = Object.keys(routes);

  if (routeKeys.length === 0) {
    return "";
  }

  const tsContent =
    `// 当前文件由 vite-plugin-uniapp-routes 自动生成，请勿修改\n\n` +
    `/* eslint-disable */\n` +
    `export enum RoutesEnum {${routeKeys
      .map((key) => {
        if (!routes[key]) {
          return "";
        }

        const comment = routes[key]?.name
          ? `\n\t/** ${routes[key]?.name} */\n`
          : "\n";

        return comment + `\t"${key}" = "${routes[key]?.path}"`;
      })
      .join(",")}\n}\n\n` +
    `export type RouteKeyType = ${routeKeys
      .map((key) => `"${key}"`)
      .join(" | ")}\n\n` +
    `export type RoutePathType = ${Object.values(routes)
      .map((value) => `"${value.path}"`)
      .join(" | ")}`;

  return tsContent;
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
  const { dir = "src", prefix } = option ?? {};
  const tsFilePath = path.join(dir, "/routes.ts");

  return {
    name: "vite-plugin-uniapp-routes",
    buildStart: () => {
      const jsonContent = readFileSync("src/pages.json", "utf-8");
      const json = JSON.parse(jsonContent);
      let tsContent = genTsCode(json);

      if (Array.isArray(prefix) && prefix.length > 0) {
        tsContent = prefix.join("\n") + "\n\n" + tsContent;
      }

      if (prefix && typeof prefix === "string") {
        tsContent = prefix + "\n\n" + tsContent;
      }

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
