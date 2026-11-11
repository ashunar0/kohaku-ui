import { Children, cloneElement, isValidElement, type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from "react"

/**
 * Lucide 等の SVG に kohaku のサイズ規約を与える。
 * 期待する幾何: viewBox 0 0 24 24 / stroke-width 2 / round / currentColor
 *
 * 使い方は 2 つ。
 *
 * 1. パスを children に書く（kohaku が <svg> を出す）
 *      <Icon><path d="…" /></Icon>
 *
 * 2. `asChild` で、既に <svg> を出すコンポーネントをそのまま通す。
 *    Lucide のようなアイコンライブラリはこちら。kohaku は data-* と
 *    aria-hidden を足すだけで、幾何には触らない（ライブラリ側が持っている）
 *      <Icon asChild><Search /></Icon>
 */
export type IconProps = ComponentPropsWithoutRef<"svg"> & {
  size?: "sm" | "md" | "lg" | "xl"
  /** children の <svg> に data-* を付けるだけにする。kohaku は <svg> を出さない */
  asChild?: boolean
  children?: ReactNode
}

export function Icon({ size, asChild, children, ...props }: IconProps) {
  if (asChild) {
    const child = Children.only(children)
    if (!isValidElement(child)) return null
    /* 利用側が child に直接書いた属性を勝たせる（kohaku は既定を与えるだけ） */
    return cloneElement(child as ReactElement<Record<string, unknown>>, {
      "data-kh": "icon",
      "data-size": size,
      "aria-hidden": true,
      ...props,
      ...(child.props as Record<string, unknown>),
    })
  }

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
