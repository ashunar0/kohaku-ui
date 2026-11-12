import type { ComponentPropsWithoutRef } from "react"

export type VisuallyHiddenProps = ComponentPropsWithoutRef<"span">

/** 画面には出さず、読み上げにだけ出す（アイコンだけの列の見出しなど） */
export function VisuallyHidden(props: VisuallyHiddenProps) {
  return <span data-kh="visually-hidden" {...props} />
}
