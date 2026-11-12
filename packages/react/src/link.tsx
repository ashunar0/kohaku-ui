import { Children, cloneElement, isValidElement, type ComponentPropsWithoutRef, type ReactElement } from "react"

/**
 * 常に下線のあるリンク。hover で色が濃くなる。
 *
 * 1. そのまま使うと <a> を出す
 *      <Link href="/rules">経費精算の規程</Link>
 *
 * 2. `asChild` で、子の要素に見た目だけ渡す。表の行を開く <button> や、
 *    ルーターの Link（自分で <a> を出すもの）はこちら
 *      <Link asChild><button type="button" onClick={open}>EX-1042</button></Link>
 */
export type LinkProps = ComponentPropsWithoutRef<"a"> & {
  /** children の要素に data-kh を付けるだけにする。kohaku は <a> を出さない */
  asChild?: boolean
}

export function Link({ asChild, children, ...props }: LinkProps) {
  if (asChild) {
    const child = Children.only(children)
    if (!isValidElement(child)) return null
    /* 利用側が child に直接書いた属性を勝たせる（kohaku は既定を与えるだけ） */
    return cloneElement(child as ReactElement<Record<string, unknown>>, {
      "data-kh": "link",
      ...props,
      ...(child.props as Record<string, unknown>),
    })
  }
  return <a data-kh="link" {...props}>{children}</a>
}
