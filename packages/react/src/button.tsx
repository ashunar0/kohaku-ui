import type { ComponentPropsWithoutRef } from "react"
import type { Size } from "./types"

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "solid" | "outline" | "ghost" | "danger"
  size?: Size
}

export function Button({ variant, size, type = "button", ...props }: ButtonProps) {
  return <button data-kh="button" data-variant={variant} data-size={size} type={type} {...props} />
}
