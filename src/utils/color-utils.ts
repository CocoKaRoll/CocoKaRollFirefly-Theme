/**
 * 动态配色（HCT / Material Color Utilities）
 * ============================================================
 * 把 Firefly 原本「单一 --hue + oklch 公式派生」的配色，升级为
 * Material 3 基于 HCT 的完整调色板（对齐 Shirone 的动态配色能力）。
 *
 * ── 为什么能这样接 ──────────────────────────────────────────
 * Firefly 的主题色只有一个写入点：`--hue`（`Layout.astro` 首帧 + `setHue()`）。
 * 所有颜色都靠 CSS 里的 `oklch(… var(--hue))` 公式派生。
 * 所以不必改动任何现有组件：只要在 `--hue` 之外，额外写入一组 `--mc-*`
 * 令牌，再把 M3 令牌层指过去即可（见 src/styles/m3-tokens.css）。
 *
 * ── 为什么是异步增强，而不是首帧就位 ────────────────────────
 * `@material/material-color-utilities` 需要打包进客户端（约 60KB gzip）。
 * 若放进 `Layout.astro` 的首帧 inline 脚本，会显著拖慢首帧；
 * 而 inline 脚本既不能 `import`，改成 `type="module"` 又会被延后到渲染之后
 * （破坏 Firefly 刻意的「首帧无闪烁」设计 —— 见 Layout.astro 的相关注释）。
 *
 * 因此采用两段式：
 *   1. 首帧：沿用现有 `--hue` + oklch 公式，快速且无闪烁
 *   2. 随后：动态 import 本模块，写入 `--mc-*` 完整调色板，
 *      由 CSS 自动接管（有过渡，不会跳变）
 * m3-tokens.css 里所有消费点都写成 `var(--mc-x, <oklch 回退>)`，
 * 所以模块未加载 / 加载失败时，观感与改造前一致，属于无损降级。
 *
 * ── 可选开关 ────────────────────────────────────────────────
 * 站点可在 `siteConfig.themeColor.dynamicPalette === false` 时关闭本增强，
 * 关闭后完全不加载本模块（零额外负担），配色仍是原来的 oklch 方案。
 */

import {
	Hct,
	MaterialDynamicColors,
	SchemeContent,
	SchemeExpressive,
	SchemeFidelity,
	SchemeFruitSalad,
	SchemeMonochrome,
	SchemeNeutral,
	SchemeRainbow,
	SchemeTonalSpot,
	SchemeVibrant,
	hexFromArgb,
} from "@material/material-color-utilities";

/** 与 Shirone 对齐的配色风格集合 */
export const COLOR_STYLES = {
	tonalSpot: SchemeTonalSpot,
	vibrant: SchemeVibrant,
	expressive: SchemeExpressive,
	content: SchemeContent,
	fidelity: SchemeFidelity,
	monochrome: SchemeMonochrome,
	neutral: SchemeNeutral,
	rainbow: SchemeRainbow,
	fruitSalad: SchemeFruitSalad,
} as const;

export type ColorStyleName = keyof typeof COLOR_STYLES;

/** 写入 :root 的 M3 角色（顺序即输出顺序，便于 diff） */
const ROLES = [
	"primary",
	"onPrimary",
	"primaryContainer",
	"onPrimaryContainer",
	"secondary",
	"onSecondary",
	"secondaryContainer",
	"onSecondaryContainer",
	"tertiary",
	"onTertiary",
	"tertiaryContainer",
	"onTertiaryContainer",
	"error",
	"onError",
	"errorContainer",
	"onErrorContainer",
	"surface",
	"surfaceDim",
	"surfaceBright",
	"surfaceContainerLowest",
	"surfaceContainerLow",
	"surfaceContainer",
	"surfaceContainerHigh",
	"surfaceContainerHighest",
	"surfaceVariant",
	"onSurface",
	"onSurfaceVariant",
	"outline",
	"outlineVariant",
	"inverseSurface",
	"inverseOnSurface",
	"inversePrimary",
] as const;

/**
 * 由纯色相数值派生 HCT 种子色。
 * 与本站既有的 `hsl(var(--hue) 90% 60%)`（theme-color meta）保持同一取色基准，
 * 因此「同一个 hue」在升级前后观感连贯。
 */
export function seedHctFromHue(hue: number): Hct {
	const s = 0.9;
	const l = 0.6;
	const k = (n: number) => (n + hue / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) =>
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	const r = Math.round(255 * f(0));
	const g = Math.round(255 * f(8));
	const b = Math.round(255 * f(4));
	return Hct.fromInt((0xff << 24) | (r << 16) | (g << 8) | b);
}

/**
 * 生成一整套 M3 调色板（32 个角色）。
 * 纯函数、无 DOM，便于单测与构建期复用。
 */
export function buildPalette(
	hue: number,
	isDark: boolean,
	style: ColorStyleName = "tonalSpot",
	contrastLevel = 0,
): Record<string, string> {
	const Scheme = COLOR_STYLES[style] ?? SchemeTonalSpot;
	const scheme = new Scheme(seedHctFromHue(hue), isDark, contrastLevel);
	const out: Record<string, string> = {};
	for (const role of ROLES) {
		const dc = (MaterialDynamicColors as unknown as Record<string, { getArgb(s: unknown): number }>)[
			role
		];
		out[role] = dc ? hexFromArgb(dc.getArgb(scheme)) : "";
	}
	return out;
}

function normalizeHue(raw: string | null, fallback: number): number {
	const parsed = Number.parseFloat(raw ?? "");
	if (!Number.isFinite(parsed)) return fallback;
	return ((parsed % 360) + 360) % 360;
}

export interface ApplyOptions {
	/** 默认读取 <html>.classList.contains("dark") */
	isDark?: boolean;
	/** 配色风格，默认 tonalSpot */
	style?: ColorStyleName;
	/** 配色的对比度档位，默认 0（标准） */
	contrastLevel?: number;
}

/**
 * 把调色板写入 `:root`。返回实际写入的颜色映射（便于调用方/测试断言）。
 *
 * 写入失败（例如 SSR、无 document）时静默返回 null —— 调用方无需处理，
 * CSS 会继续使用 oklch 回退值，观感不受影响。
 */
export function applyPalette(hue: number, options: ApplyOptions = {}): Record<string, string> | null {
	if (typeof document === "undefined") return null;
	const root = document.documentElement;
	const isDark = options.isDark ?? root.classList.contains("dark");
	const palette = buildPalette(
		hue,
		isDark,
		options.style ?? "tonalSpot",
		options.contrastLevel ?? 0,
	);
	for (const [role, hex] of Object.entries(palette)) {
		if (hex) root.style.setProperty(`--mc-${camelToKebab(role)}`, hex);
	}
	root.setAttribute("data-mc-active", "true");
	return palette;
}

/** MaterialDynamicColors 的角色名是 camelCase，CSS 变量用 kebab-case */
function camelToKebab(s: string): string {
	return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/** 读取当前 hue（localStorage 优先，与 setting-utils 的约定一致） */
export function currentHue(fallback: number): number {
	if (typeof localStorage === "undefined") return fallback;
	return normalizeHue(localStorage.getItem("hue"), fallback);
}

/**
 * 异步补齐 HCT 调色板（首帧之后调用）。
 * 失败时静默降级：保留 oklch 公式配色，观感与改造前一致。
 *
 * 注意本模块刻意**不 import `@/config`** —— 开关判断交由调用点完成，
 * 以保持本模块为纯工具、避免与 config 形成循环依赖。
 */
export async function enhancePaletteWithHct(
	configHue: number,
	options: ApplyOptions = {},
): Promise<Record<string, string> | null> {
	try {
		return applyPalette(currentHue(configHue), options);
	} catch (error) {
		if (import.meta.env?.DEV) {
			console.warn(
				"[color-utils] HCT palette unavailable, keeping oklch fallback:",
				error,
			);
		}
		return null;
	}
}
