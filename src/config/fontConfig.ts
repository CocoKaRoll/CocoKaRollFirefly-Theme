/**
 * 字体配置（统一入口）
 *
 * 所有字体相关配置都在此文件中定义：
 *   详细用法请参考 Astro 官方文档：https://docs.astro.build/en/guides/fonts
 * - fonts：Astro Font API 字体定义（自动下载、缓存、优化加载）
 * - fontConfig：字体选择与区域覆盖
 *
 * 添加新字体只需编辑本文件：
 * 1. 在下方 fonts 数组中添加字体定义
 * 2. 在 fontConfig.selected 或区域字段中引用对应的 cssVariable
 *
 * 支持的 provider：https://docs.astro.build/en/reference/font-provider-reference/#built-in-providers
 *   "google"     - Google Fonts
 *   "fontsource" - Fontsource
 *   "local"      - 本地字体文件
 *   "bunny"      - Bunny Fonts
 *   "fontshare"  - Fontshare
 *   "npm"        - NPM 包（如 @fontsource/*）
 *
 * 本地字体子集化：在 fontConfig.subsetFonts 中添加对应 cssVariable 的配置，
 * 构建时脚本会自动扫描页面字符并生成轻量 woff2 子集。
 *
 * ─────────────────────────────────────────────────────────────
 *  当前字体方案：对齐 Shirone（LyraVoid/Shirone）的视觉语言
 * ─────────────────────────────────────────────────────────────
 *  Shirone 是 Fuwari 的另一个分支，字体角色划分与本主题一致，其搭配为：
 *    body  Outfit            —— 现代几何圆润西文，配 M3E 大圆角
 *    cjk   Yozai Medium      —— 悠哉圆体，圆润手写感中文
 *    mono  JetBrains Mono    —— 代码等宽
 *
 *  但两个主题的「字体配置架构」不同，无法直接照抄配置：
 *    Shirone  角色制：mode + fontFamilies[{ role: body|cjk|mono }]
 *    Firefly  provider 制：fonts[]（Astro Font API）+ selected[] + 分区域字段
 *  因此这里把 Shirone 的搭配「映射」到本主题既有架构里，行为等价。
 *
 *  关于 CJK 字体的取舍（重要，请阅读）：
 *    Yozai 不在 Fontsource、也没有可用 npm 包（两者均已实测确认），
 *    Shirone 用的是仓库内约 20MB 的本地 src/assets/fonts/Yozai-Medium.ttf，
 *    靠构建期子集化压到几百 KB。该二进制字体文件无法通过配置生成。
 *    因此默认 CJK 角色使用 Noto Sans SC（Google 官方简体中文黑体，圆润几何风格），
 *    并且复用本主题 package.json 里「已有」的 @fontsource-variable/noto-sans-sc，
 *    做到零新增字体依赖、零构建期联网下载。
 *
 *    若要完全照抄 Shirone 的悠哉圆体，只需两步：
 *      1. 把 Yozai-Medium.ttf 放到 public/assets/fonts/ 目录
 *      2. 取消下方 YOZAI 块的注释，并把 selected 里的 --font-noto-sans-sc
 *         换成 --font-yozai
 */
import type { FontDefinition, FontSelectionConfig } from "@/types/fontConfig";

// ─── Astro Font API 字体定义 ───────────────────────────────
// 适用于 Astro Font API 的字体配置，支持自动下载、缓存和优化加载
// 本地开发调试的情况下，修改后需要每次重启开发服务器才能生效
export const fontsList: FontDefinition[] = [
	// ── body：正文西文（Outfit，对齐 Shirone）──
	{
		name: "Outfit",
		cssVariable: "--font-outfit",
		provider: "fontsource",
		weights: ["300", "400", "500", "600", "700"],
		styles: ["normal"],
		subsets: ["latin", "latin-ext"],
		fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
		display: "swap",
	},

	// ── cjk：中日韩（Noto Sans SC，替代 Shirone 的 Yozai）──
	// 用 npm provider 直接引包内 CSS：@fontsource-variable/noto-sans-sc 是
	// 可变字体包，内部按 unicode-range 分片，浏览器只下载命中的分片；
	// 相比 fontsource provider 的 CJK 子集解析，这条路路径确定、且不联网下载。
	{
		name: "Noto Sans SC Variable",
		cssVariable: "--font-noto-sans-sc",
		provider: "npm",
		options: {
			variants: [
				{
					src: ["@fontsource-variable/noto-sans-sc/index.css"],
					weight: "100 900",
					style: "normal",
				},
			],
		},
		fallbacks: ["system-ui", "sans-serif"],
		display: "swap",
	},

	// ── mono：代码等宽（JetBrains Mono，对齐 Shirone）──
	// Shirone 用的是 @fontsource-variable/jetbrains-mono（可变字体），
	// 本主题未装该包，这里用等价的静态包 @fontsource/jetbrains-mono（仅 400/700）。
	// 若想连可变字重一起照抄：pnpm add @fontsource-variable/jetbrains-mono 后
	// 把 provider 改成 npm + options.variants 指向 index.css，weight 写 "100 800"。
	{
		name: "JetBrains Mono",
		cssVariable: "--font-jetbrains-mono",
		provider: "fontsource",
		weights: ["400", "700"],
		styles: ["normal"],
		subsets: ["latin", "latin-ext"],
		fallbacks: [
			"ui-monospace",
			"SFMono-Regular",
			"Menlo",
			"Monaco",
			"Consolas",
			"Liberation Mono",
			"Courier New",
			"monospace",
		],
		display: "swap",
	},

	// ── YOZAI（可选）：完全照抄 Shirone 的中文圆体 ──
	// 需要自行提供字体文件后取消注释，并把 fontConfig.selected 里的
	// --font-noto-sans-sc 换成 --font-yozai。
	// {
	// 	name: "Yozai Medium",
	// 	cssVariable: "--font-yozai",
	// 	provider: "local",
	// 	options: {
	// 		variants: [
	// 			{
	// 				src: ["./public/assets/fonts/Yozai-Medium.ttf"],
	// 				weight: 500,
	// 				style: "normal",
	// 			},
	// 		],
	// 	},
	// 	fallbacks: ["system-ui", "sans-serif"],
	// 	display: "swap",
	// },

	// ─── 本地字体示例 ───
	// 使用步骤：
	// 1. 将 TTF/OTF/WOFF2 字体文件放在 public/assets/fonts/ 目录下
	// 2. 参考下方配置填写正确的字体信息
	// 3. 在 fontConfig.selected 或区域字段中引用 cssVariable
	{
		name: "GreatVibes Regular 2",
		cssVariable: "--font-greatvibes",
		provider: "local",
		options: {
			variants: [
				{
					src: ["./public/assets/fonts/GreatVibes-Regular-2.otf"],
				},
			],
		},
		fallbacks: ["sans-serif"],
	},
];

// ─── 字体选择与区域覆盖 ─────────────────────────────────────
export const fontConfig: FontSelectionConfig = {
	// 是否启用自定义字体功能
	enable: true,
	// 当前选择的字体 CSS 变量名（对应上方 fonts 中的 cssVariable）
	// 使用 "system" 表示系统字体（不加载任何自定义字体）
	//
	// 顺序即优先级：西文命中 Outfit，汉字回退到 Noto Sans SC，
	// 两者都缺字时再落到系统字体栈（FontSetup 会自动补上保底栈）。
	selected: ["--font-outfit", "--font-noto-sans-sc"],

	// 各区域独立字体设置（填写上方 fonts 中的 cssVariable，留空则使用全局 selected 字体）
	// 例如：bannerTitleFont: "--font-inter", 表示主页横幅主标题使用 Inter 字体
	// 主页横幅主标题字体
	bannerTitleFont: "--font-outfit",
	// 主页横幅副标题字体
	bannerSubtitleFont: "--font-outfit",
	// 导航栏标题字体
	navbarTitleFont: "--font-outfit",
	// 代码块字体（用于代码高亮和等宽字体场景）
	codeFont: "--font-jetbrains-mono",

	// 本地字体子集化配置（构建时由 scripts/subset-fonts.ts 处理）
	// key 为 fonts 数组中对应的 cssVariable，value 为子集化选项
	subsetFonts: {
		"--font-greatvibes": {
			// 额外包含的字符
			extraChars: "",
		},
	},
};
