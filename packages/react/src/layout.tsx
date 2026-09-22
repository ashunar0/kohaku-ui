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
