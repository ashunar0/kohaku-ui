import type { ComponentPropsWithoutRef } from "react"
import type { Size } from "./types"

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "solid" | "outline" | "ghost" | "danger"
  size?: Size
}

export function Button({ variant, size, type = "button", ...props }: ButtonProps) {
  return <button data-kh="button" data-variant={variant} data-size={size} type={type} {...props} />
}

/**
 * アイコンだけのボタン。正方形になる。
 *
 * `label` は必須。アイコンしか無いので、名前が無いと読み上げで「ボタン」になる。
 * 書くのは「操作の名前」で、絵柄の名前ではない（虫眼鏡なら「拡大」ではなく「探す」）。
 * 見た目は Button と同じ CSS（`data-icon` が付くだけ）なので variant / size はそのまま使える。
 */
export type IconButtonProps = Omit<ButtonProps, "aria-label"> & { label: string }

export function IconButton({ label, ...props }: IconButtonProps) {
  return <Button data-icon="" aria-label={label} {...props} />
}
