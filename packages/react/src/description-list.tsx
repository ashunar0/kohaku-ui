import type { ComponentPropsWithoutRef, ReactNode } from "react"

export type DescriptionListProps = ComponentPropsWithoutRef<"dl">
export type DescriptionListItemProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  /** 項目名 */
  term: ReactNode
  /** 値 */
  children?: ReactNode
  /** 項目名のそろえ方。既定は値の 1 行目のベースライン。アイコンと名前を横に並べた 1 行の値は center */
  align?: "baseline" | "center"
}

/**
 * 項目名と値の並び（申請の詳細など）。項目名を左の列にそろえ、1 項目 1 行で並べる。
 * 項目名の列の幅は --kh-description-list-term-width（既定 8rem）。
 *
 *   <DescriptionList>
 *     <DescriptionList.Item term="部署">営業部</DescriptionList.Item>
 *   </DescriptionList>
 */
export function DescriptionList(props: DescriptionListProps) {
  return <dl data-kh="description-list" {...props} />
}

function Item({ term, align, children, ...props }: DescriptionListItemProps) {
  return (
    <div data-part="item" data-align={align} {...props}>
      <dt data-part="term">{term}</dt>
      <dd data-part="details">{children}</dd>
    </div>
  )
}
DescriptionList.Item = Item
