import type { CanvasPalette, CanvasTokens } from "./canvas-tokens.js";
import { type CanvasAction } from "./internal/canvas-action-dispatch.js";
export interface CanvasHostTheme {
    readonly kind: string;
    readonly tokens: CanvasTokens;
    readonly palette: CanvasPalette;
}
/**
 * Returns `{ kind, tokens, palette }` for the host IDE's current theme.
 * Falls back to dark-mode when no host state is available.
 *
 * **You must destructure `tokens`** — color groups (`text`, `bg`, `fill`,
 * `stroke`, `accent`, `diff`) live under `tokens`, not on the top-level
 * return value.
 *
 * @returns `CanvasHostTheme` — an object with:
 * - `kind`    — theme identifier string (e.g. `"dark"`, `"light"`)
 * - `tokens`  — nested semantic color groups for inline styles
 * - `palette` — flat palette (same colors, alternative key names)
 *
 * **Stable token paths for `style={{ ... }}` usage:**
 * - `tokens.text.primary / secondary / tertiary / quaternary` — text hierarchy
 * - `tokens.bg.editor / chrome / elevated` — surface backgrounds
 * - `tokens.fill.primary / secondary / tertiary / quaternary` — tinted fills
 * - `tokens.stroke.primary / secondary / tertiary` — borders and dividers
 * - `tokens.accent.primary / control` — accent blue and button background
 * - `tokens.text.link` — link color
 * - `tokens.text.onAccent` — text on accent-colored surfaces
 *
 * **Prefer built-in components** (`Card`, `Button`, `Text`, etc.) over raw token
 * usage. Use tokens directly only when no component covers your use case.
 * When you do use tokens, stick to **flat solid colors** — no gradients, no
 * box-shadows, no decorative effects. The canvas design language is minimal.
 *
 * @example
 * ```tsx
 * const { tokens: t } = useHostTheme();
 *
 * <div style={{ background: t.fill.tertiary, color: t.text.secondary, padding: 8 }}>
 *   Custom surface
 * </div>
 *
 * <div style={{ color: t.accent.primary }}>Accent text</div>
 * ```
 */
export declare function useHostTheme(): CanvasHostTheme;
/**
 * Setter for `useCanvasState`. Accepts either a new value or an updater
 * function that receives the previous value.
 */
export type SetCanvasState<T> = (action: T | ((prev: T) => T)) => void;
/**
 * Persistent state hook for canvas applications. Works like `React.useState`
 * but the value survives rebuilds, reloads, and IDE restarts — it is stored
 * in a `.canvas.data.json` sidecar file next to the canvas source.
 *
 * Each key is a unique string chosen by the canvas author. Keys are stable
 * regardless of hook call order or component tree structure.
 *
 * @param key - Unique string identifier for this piece of state.
 * @param defaultValue - Value returned when no persisted value exists for `key`.
 * @returns A `[value, setValue]` tuple, same shape as `React.useState`.
 *
 * @example
 * ```tsx
 * function Counter() {
 *   const [count, setCount] = useCanvasState("count", 0);
 *   return <Button onClick={() => setCount(c => c + 1)}>{count}</Button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * interface Column { id: string; title: string; cardIds: string[] }
 * function KanbanBoard() {
 *   const [columns, setColumns] = useCanvasState<Column[]>("columns", [
 *     { id: "todo", title: "To Do", cardIds: [] },
 *     { id: "doing", title: "In Progress", cardIds: [] },
 *     { id: "done", title: "Done", cardIds: [] },
 *   ]);
 *   // ...
 * }
 * ```
 */
export declare function useCanvasState<T>(key: string, defaultValue: T): [T, SetCanvasState<T>];
export type { CanvasAction };
/**
 * Returns a stable `dispatch` function for triggering IDE actions from
 * canvas buttons. Actions are fire-and-forget — the canvas does not
 * receive a response.
 *
 * ## Available actions
 *
 * **`openAgent`** — Navigate the IDE to an agent conversation.
 * `agentId` is the conversation UUID (the filename stem from the
 * `agent-transcripts/` directory). Works for both local and
 * cloud/background agents in Glass and classic IDE modes.
 *
 * @example
 * ```tsx
 * function AgentLink({ agentId, title }: { agentId: string; title: string }) {
 *   const dispatch = useCanvasAction();
 *   return (
 *     <Button onClick={() => dispatch({ type: "openAgent", agentId })}>
 *       {title}
 *     </Button>
 *   );
 * }
 * ```
 */
export declare function useCanvasAction(): (action: CanvasAction) => void;
//# sourceMappingURL=hooks.d.ts.map