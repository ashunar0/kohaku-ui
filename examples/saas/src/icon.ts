/**
 * Lucide の svg に kohaku のサイズ規約を与える。
 *
 * kohaku はアイコンを同梱しない（部品を操作するための図形だけ tokens.css に data URI で持つ）。
 * `@kohaku/react` の `Icon` は children にパスを書く前提なので、Lucide のコンポーネントを
 * そのまま使うときは `data-kh="icon"` を自分で付ける。Lucide の既定の幾何
 * （viewBox 24 / stroke-width 2 / round / currentColor）は kohaku が期待するものと同じ。
 */
export const khIcon = { "data-kh": "icon", "aria-hidden": true } as const
