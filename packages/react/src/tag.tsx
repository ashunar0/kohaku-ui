import type { ComponentPropsWithoutRef } from "react"

export type TagProps = ComponentPropsWithoutRef<"span"> & {
  /** 値の種別（「状態」「取引先」など）。前に小さく出す */
  type?: string
  /** 渡すと外すボタンを出す */
  onRemove?: () => void
  /** 外すボタンの読み上げ。既定は中身から「状態「承認待ち」を外す」を作る */
  removeLabel?: string
}

/** 選んだ値を示す札。外せる。状態を示すだけで外さないものは Badge */
export function Tag({ type, onRemove, removeLabel, children, ...props }: TagProps) {
  const text = typeof children === "string" || typeof children === "number" ? String(children) : ""
  const label = removeLabel ?? `${type ?? ""}「${text}」を外す`
  return (
    <span data-kh="tag" {...props}>
      {type ? <span data-part="type">{type}</span> : null}
      {children}
      {onRemove ? <button type="button" data-part="remove" aria-label={label} onClick={onRemove} /> : null}
    </span>
  )
}
