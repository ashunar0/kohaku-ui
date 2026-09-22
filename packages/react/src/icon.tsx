import type { ComponentPropsWithoutRef, ReactNode } from "react"

/**
 * Lucide 等の SVG に kohaku のサイズ規約を与える。
 * 期待する幾何: viewBox 0 0 24 24 / stroke-width 2 / round / currentColor
 */
export type IconProps = ComponentPropsWithoutRef<"svg"> & {
  size?: "sm" | "md" | "lg" | "xl"
  children?: ReactNode
}

export function Icon({ size, children, ...props }: IconProps) {
  return (
    <svg
      data-kh="icon"
      data-size={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}
