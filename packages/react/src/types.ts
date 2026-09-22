export type Size = "xs" | "sm" | "md" | "lg"
export type FieldSize = "sm" | "md" | "lg"

/** data-* に渡す前に undefined を落とす。false も属性を消す */
export const attr = (v: string | boolean | undefined) =>
  v === undefined || v === false ? undefined : v === true ? "" : v
