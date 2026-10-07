# 🌸 CocoKaRoll Firefly Theme

> 基于 https://github.com/CuteLeaf/Firefly 深度定制的 **清新 · 唯美 · 强氛围感** Astro 静态博客主题  
> 「Firefly 有的它都有，Firefly 没那么好看的，它帮你补上」

CocoKaRoll Firefly Theme 是在 Firefly 主题基础上的**重度美化分支**：  
保留 Firefly 的双侧边栏、文章网格 / 瀑布流、音乐播放器、日历、目录、友链、评论、搜索等完整能力，  
在此基础上重做视觉层、动效层、卡片层与细节交互，让博客更像「会呼吸的个人空间」。

---

## ✨ 主题定位

- 🌿 **继承自 Firefly**：Astro + Tailwind CSS，静态生成，加载飞快，SEO 友好
- 🎀 **深度美化**：配色、圆角、阴影、卡片、字体排印、hover 动效全面升级
- 🎠 **氛围组件增强**：音乐、樱花、看板娘、壁纸、公告、站点统计更有“博客魂”
- 🧩 **配置友好**：Firefly 的 `src/config/*` 体系完整保留，会配 Firefly 就会配它
- 📱 **移动端精修**：不是“能看”，而是“手机上也好看到想截图”

---

## 🎨 相比原版 Firefly 做了什么

> 一句话：不是换皮，是「把 Firefly 调成最舒服的样子」

- 重新设计的：
  - 首页 Hero / Banner
  - 文章卡片与封面
  - 侧边栏小组件样式
  - 代码块 / 引用块 / 提醒块
  - 分页、归档、标签、分类页
- 增强的氛围细节：
  - 更柔和的亮 / 暗色方案
  - 更顺滑的页面过渡
  - 更精致的悬浮、入场、滚动动效
  - 音乐播放器、樱花、壁纸模式视觉统一
- 保留的 Firefly 能力：
  - 单侧 / 双侧边栏
  - 列表 / 网格 / 瀑布流文章布局
  - Pagefind 搜索
  - Twikoo / Waline / Giscus / Artalk 评论
  - APlayer 音乐、Live2D / Spine 看板娘
  - 友链、赞助、番组、分享海报、站点统计、日历

---

## ⚡ 核心特性

- ⚡ **Astro 静态生成**：极速加载、优秀 SEO、部署到 Vercel / Netlify / Cloudflare Pages / EdgeOne Pages 都很容易
- 🎨 **清新美观**：为“长期写博客的人”设计的审美，不花哨但很耐看
- 🖼️ **强视觉布局**：双侧边栏 + 网格 + 瀑布流，内容多也不乱
- 🎵 **博客氛围系统**：音乐、樱花、壁纸、看板娘、公告、站点运行时间
- 🌗 **主题模式**：亮色 / 暗色 / 跟随系统，主题色 360° 色相调节
- 📱 **移动端专项优化**：导航、侧边栏、播放器、目录都重新照顾过
- 🔧 **高度可配置**：站点信息、资料、导航、侧边栏、字体、音乐、评论、友链全部走配置
- 🌍 **i18n 支持**：简体中文优先，其他语言继承 Firefly 的 AI 翻译方案

---

## 🚀 快速开始

> 要求：Node.js ≥ 22，pnpm ≥ 9（与 Firefly 保持一致）

```bash
# 克隆本仓库（或先 Fork 再克隆）
git clone https://github.com/CocoKaRoll/CocoKaRollFirefly-Theme.git
cd CocoKaRollFirefly-Theme

# 安装依赖
npm install -g pnpm
pnpm install

# 本地开发
pnpm dev
```

打开 http://localhost:4321 即可预览。

---

## 📦 部署

| 平台 | 说明 |
|---|---|
| Vercel | Framework: Astro |
| Netlify | Build: `pnpm run build` |
| Cloudflare Pages | Output: `dist` |
| EdgeOne Pages | 安装 `pnpm install`，构建 `pnpm run build` |

通用配置：

- 框架预设：**Astro**
- 根目录：`./`
- 安装命令：`pnpm install`
- 构建命令：`pnpm run build`
- 输出目录：`dist`

---

## 🛠 配置方式

沿用 Firefly 的模块化配置：

```text
src/config/
├── siteConfig.ts          # 站点基础信息
├── profileConfig.ts       # 作者资料
├── navBarConfig.ts        # 导航栏
├── sidebarConfig.ts       # 侧边栏
├── fontConfig.ts          # 字体
├── musicConfig.ts         # 音乐播放器
├── pioConfig.ts           # 看板娘
├── friendsConfig.ts       # 友链
├── commentConfig.ts       # 评论系统
├── announcementConfig.ts  # 公告
├── backgroundWallpaper.ts # 壁纸
└── ...
```

设置默认语言：

```ts
// src/config/siteConfig.ts
const SITE_LANG = "zh_CN";
```

---

## 📝 文章 Frontmatter

```md
---
title: 我的第一篇文章
published: 2026-10-07
description: 这是用 CocoKaRoll Firefly Theme 写的第一篇博客
image: ./cover.jpg   # 也可用 "api" 启用随机封面
tags: [Astro, Blog]
category: 前端
draft: false
lang: zh-CN
pinned: false
comment: true
---
```

---

## 🙏 致谢 / 血缘关系

```text
saicaca/fuwari
   └── CuteLeaf/Firefly
         └── CocoKaRoll/CocoKaRollFirefly-Theme
```

- 感谢 https://github.com/saicaca 的 Fuwari
- 感谢 https://github.com/CuteLeaf/Firefly 提供的完整功能底座
- CocoKaRoll Firefly Theme = **Firefly 能力 + CocoKaRoll 审美**

---

## 📄 License

基于 Firefly / Fuwari 的 MIT 协议衍生修改。  
使用、修改、分发请保留原始版权声明：

- Copyright (c) 2024 saicaca — fuwari
- Copyright (c) 2025 CuteLeaf — Firefly
- CocoKaRoll Firefly Theme — 美化与定制部分归本仓库维护者
