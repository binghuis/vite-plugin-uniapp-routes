# vite-plugin-uniapp-routes

一个根据 `pages.json` 自动生成路由枚举文件的 Vite 插件。

![vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&labelColor=263238)
[![npm version](https://img.shields.io/npm/v/vite-plugin-uniapp-routes)](https://www.npmjs.com/package/vite-plugin-uniapp-routes)

当 `pages.json` 文件改变时更新 `src/routes.ts`。

<img src='https://raw.githubusercontent.com/binghuis/assets/main/vite-plugin-uniapp-routes/compare.png'/>

## 安装

`pnpm i vite-plugin-uniapp-routes -D`

## 使用

```ts
import { uniappRoutes } from "vite-plugin-uniapp-routes";

export default defineConfig({
  plugins: [uniappRoutes()],
});
```
