import type { ComponentPropsWithoutRef } from "react"
import type { FieldSize } from "./types"

/** コントロールを横に並べる。サイズの一括指定と連結を担う */
export type GroupProps = ComponentPropsWithoutRef<"div"> & {
  size?: FieldSize
  /** 隙間なく連結する（検索欄 + 実行ボタンなど） */
  attached?: boolean
}
export function Group({ size, attached, ...props }: GroupProps) {
  return <div data-kh="group" data-size={size} data-attached={attached ? "" : undefined} {...props} />
}

/** 操作の行。既定は右寄せ */
export type ActionsProps = ComponentPropsWithoutRef<"div"> & {
  align?: "start" | "end" | "between"
}
export function Actions({ align, ...props }: ActionsProps) {
  return <div data-kh="actions" data-align={align === "end" ? undefined : align} {...props} />
}

/**
 * 入力欄の外に添える単位や文字（歳・年・円）。Group の中で入力欄の隣に置く。
 * 読み上げには出さないので、入力欄の意味はラベルか aria-label で持たせる。
 */
export type AffixProps = ComponentPropsWithoutRef<"span">
export function Affix(props: AffixProps) {
  return <span data-kh="affix" aria-hidden="true" {...props} />
}
