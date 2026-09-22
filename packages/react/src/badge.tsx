import type { ComponentPropsWithoutRef } from "react"

export type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: "neutral" | "outline" | "accent" | "danger" | "warning" | "success" | "info"
}

export function Badge({ variant, ...props }: BadgeProps) {
  return <span data-kh="badge" data-variant={variant} {...props} />
}
