import type { ComponentPropsWithoutRef } from "react"

export type TableProps = ComponentPropsWithoutRef<"table">

/**
 * 素の <table> を div[data-kh="table"] で包む。中身は thead / tr / td をそのまま書く。
 * セルには data-numeric（右揃え・等幅数字）/ data-fit（中身の幅まで縮める）、
 * 行には data-selected を付けられる。
 *
 * 包む div を自分で持ちたいとき（TanStack の仮想スクロールなど）は、
 * この部品を使わず div に data-kh="table" を付ければ同じ見た目になる。
 */
export function Table(props: TableProps) {
  return (
    <div data-kh="table">
      <table {...props} />
    </div>
  )
}
