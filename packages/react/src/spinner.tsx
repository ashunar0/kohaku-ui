import type { ComponentPropsWithoutRef } from "react"

export type SpinnerProps = ComponentPropsWithoutRef<"span"> & {
  /** sm 16 / md 24（既定）/ lg 32px */
  size?: "sm" | "md" | "lg"
  /** 読み上げる文言。画面には出ない */
  label?: string
}

/** 読み込み中を示す。role="status" で、label を読み上げる */
export function Spinner({ size, label = "読み込み中", ...props }: SpinnerProps) {
  return (
    <span data-kh="spinner" data-size={size} role="status" {...props}>
      <svg viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="20" /></svg>
      <span data-kh="visually-hidden">{label}</span>
    </span>
  )
}
