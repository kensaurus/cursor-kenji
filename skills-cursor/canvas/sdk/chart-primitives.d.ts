/**
 * Chart primitives for `cursor/canvas` — multi-series, stacked, and pie charts
 * rendered as pure inline SVG with zero external dependencies.
 *
 * Distilled from the portal-website Highcharts analytics charting layer.
 */
import type { CSSProperties, JSX } from "react";
/** A single labeled value, used by `PieChart`. */
export type ChartDataPoint = {
    label: string;
    /** Non-negative numeric value. */
    value: number;
};
/**
 * A named data series for `BarChart` and `LineChart`.
 * The `data` array aligns by index with the parent component's `categories`.
 * If `color` is omitted, one is assigned from `chartColorSequence`.
 */
export type ChartSeries = {
    name: string;
    data: number[];
    color?: string;
};
export type BarChartProps = {
    /** Category labels along the independent axis. */
    categories: string[];
    /** One or more data series. Values align by index with `categories`. */
    series: ChartSeries[];
    height?: number;
    /** Stack series on top of each other instead of grouping side-by-side. */
    stacked?: boolean;
    /** Render horizontal bars instead of vertical columns. */
    horizontal?: boolean;
    /** Show as 100% stacked (implies `stacked`). */
    normalized?: boolean;
    /** Suffix for y-axis tick labels (e.g. "%"). */
    valueSuffix?: string;
    style?: CSSProperties;
};
export type LineChartProps = {
    categories: string[];
    series: ChartSeries[];
    height?: number;
    /** Fill the area under each line with a soft tint. */
    fill?: boolean;
    valueSuffix?: string;
    style?: CSSProperties;
};
export type PieChartProps = {
    data: Array<ChartDataPoint & {
        color?: string;
    }>;
    size?: number;
    donut?: boolean;
    style?: CSSProperties;
};
/**
 * Multi-series bar/column chart with optional stacking and normalization.
 * Distilled from the portal-website Highcharts analytics charts.
 *
 * Pass `categories` for x-axis labels and one or more `series` whose `data`
 * arrays align by index. With a single series you get simple bars; with
 * multiple series the default is grouped (side-by-side) — set `stacked` for
 * stacked columns or `normalized` for 100%-stacked share-mode.
 *
 * Colors are assigned automatically from `chartColorSequence`. With a **single
 * series**, each bar gets a different color by category (so a chart of 5
 * categories shows 5 colors out of the box). With **multiple series**, each
 * series gets its own color. Override with the `color` field on any series.
 * A legend appears when there are 2+ series.
 *
 * @example
 * ```tsx
 * // Simple single-series
 * <BarChart
 *   categories={["Mon", "Tue", "Wed"]}
 *   series={[{ name: "Requests", data: [120, 90, 150] }]}
 * />
 *
 * // Stacked multi-series (like portal AI commit chart)
 * <BarChart
 *   categories={["Mon", "Tue", "Wed"]}
 *   series={[
 *     { name: "IDE", data: [120, 90, 150] },
 *     { name: "CLI", data: [30, 40, 25] },
 *     { name: "Cloud", data: [50, 60, 70] },
 *   ]}
 *   stacked
 * />
 *
 * // 100% stacked share mode
 * <BarChart
 *   categories={["Mon", "Tue", "Wed"]}
 *   series={[
 *     { name: "AI", data: [70, 80, 60] },
 *     { name: "Other", data: [30, 20, 40] },
 *   ]}
 *   normalized
 *   valueSuffix="%"
 * />
 * ```
 */
export declare function BarChart({ categories, series, height, stacked, horizontal, normalized, valueSuffix, style }: BarChartProps): JSX.Element;
/**
 * Multi-series line chart with optional area fill. Distilled from the
 * portal-website Highcharts analytics charts.
 *
 * Each series draws a polyline with dot markers at each data point.
 * Set `fill` to shade the area under every line. Hover over any category
 * column to see a tooltip with all series values at that point.
 *
 * This is **not** a time-series component — it does not parse dates.
 * Pass pre-formatted date strings as `categories` if plotting over time.
 *
 * @example
 * ```tsx
 * // Single line
 * <LineChart
 *   categories={["Jan", "Feb", "Mar", "Apr"]}
 *   series={[{ name: "Revenue", data: [100, 140, 120, 180] }]}
 * />
 *
 * // Multi-series with area fill
 * <LineChart
 *   categories={["Jan", "Feb", "Mar", "Apr"]}
 *   series={[
 *     { name: "Accepted", data: [50, 70, 60, 90] },
 *     { name: "Suggested", data: [120, 140, 130, 160] },
 *   ]}
 *   fill
 * />
 * ```
 */
export declare function LineChart({ categories, series, height, fill, valueSuffix, style }: LineChartProps): JSX.Element;
/**
 * Pie (or donut) chart with hover highlighting. Distilled from the
 * portal-website Highcharts analytics charts.
 *
 * Unlike `BarChart` and `LineChart`, `PieChart` takes a flat `data` array of
 * `{ label, value }` points — each slice is its own category. Colors cycle
 * through `chartColorSequence` unless an explicit `color` is provided per point.
 *
 * Hovering a slice expands it outward and dims the others; hovering a legend
 * item does the same. A tooltip with value and percentage appears below the
 * chart. Set `donut` for a hollow center.
 *
 * **Do not** use for bar-style comparisons — use `BarChart` instead.
 *
 * @example
 * ```tsx
 * // Basic pie
 * <PieChart
 *   data={[
 *     { label: "IDE", value: 120 },
 *     { label: "CLI", value: 30 },
 *     { label: "Cloud", value: 50 },
 *   ]}
 * />
 *
 * // Donut with explicit colors
 * <PieChart
 *   data={[
 *     { label: "AI", value: 70, color: "#1F8A65E8" },
 *     { label: "Other", value: 30, color: "#8888A8E0" },
 *   ]}
 *   donut
 * />
 * ```
 */
export declare function PieChart({ data, size, donut, style }: PieChartProps): JSX.Element;
//# sourceMappingURL=chart-primitives.d.ts.map