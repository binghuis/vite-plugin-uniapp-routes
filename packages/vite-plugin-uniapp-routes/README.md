# vite-plugin-uniapp-routes

一个根据 `pages.json` 自动生成路由枚举文件的 `Vite` 插件。

## 行为

当 `pages.json` 文件改变时在 `src` 目录下更新 `routes.ts`。

<img src='/static/routes.png' width='65%' />

## 安装

`pnpm i vite-plugin-uniapp-routes -D`

## 使用

```ts
import { uniappRoutes } from "vite-plugin-uniapp-routes";

export default defineConfig({
  plugins: [uniappRoutes()],
});
```
