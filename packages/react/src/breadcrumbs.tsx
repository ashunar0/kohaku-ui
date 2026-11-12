import type { ComponentPropsWithoutRef } from "react"

export type BreadcrumbsProps = ComponentPropsWithoutRef<"nav">

/**
 * nav > ol を組み立てる。aria-label の既定は「現在の位置」。
 * 区切りは CSS が描くので、中には Item を並べるだけでよい。
 */
function Root({ children, "aria-label": label = "現在の位置", ...props }: BreadcrumbsProps) {
  return (
    <nav data-kh="breadcrumbs" aria-label={label} {...props}>
      <ol>{children}</ol>
    </nav>
  )
}

export type BreadcrumbsItemProps = ComponentPropsWithoutRef<"li"> & {
  /** 渡すと <a> を出す。ルーターの Link を使うときは渡さず、children に Link を書く */
  href?: string
  /** 現在のページ。リンクにせず aria-current="page" を付ける */
  current?: boolean
}

function Item({ href, current, children, ...props }: BreadcrumbsItemProps) {
  return (
    <li aria-current={current ? "page" : undefined} {...props}>
      {href && !current ? <a href={href}>{children}</a> : children}
    </li>
  )
}

export const Breadcrumbs = Object.assign(Root, { Item })
