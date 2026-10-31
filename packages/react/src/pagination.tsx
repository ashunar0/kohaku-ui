import { Pagination as Ark } from "@ark-ui/react"
import type { ComponentPropsWithoutRef } from "react"

export type PaginationProps = ComponentPropsWithoutRef<typeof Ark.Root> & {
  /** 最初・最後のページへ飛ぶボタンを出す */
  showEdges?: boolean
}

/** Ark の既定は英語（"next page" など）なので日本語にする */
const translations: NonNullable<PaginationProps["translations"]> = {
  rootLabel: "ページ送り",
  firstTriggerLabel: "最初のページ",
  prevTriggerLabel: "前のページ",
  nextTriggerLabel: "次のページ",
  lastTriggerLabel: "最後のページ",
  itemLabel: ({ page, totalPages }) =>
    `${totalPages > 1 && page === totalPages ? "最後のページ、" : ""}${page} ページ目`,
}

/**
 * 前後のボタン・ページ番号・省略を組み立てて隠す。
 * type="link" のときは各ボタンを <a> にする（Ark は既定で <button> を出すため）。
 */
export function Pagination({ showEdges, translations: t, type, children, ...props }: PaginationProps) {
  const link = type === "link"
  return (
    <Ark.Root type={type} translations={{ ...translations, ...t }} {...props}>
      {showEdges ? <Ark.FirstTrigger asChild={link}>{link ? <a /> : null}</Ark.FirstTrigger> : null}
      <Ark.PrevTrigger asChild={link}>{link ? <a /> : null}</Ark.PrevTrigger>
      <Ark.Context>
        {(api) =>
          api.pages.map((page, i) =>
            page.type === "page" ? (
              <Ark.Item key={page.value} {...page} asChild={link}>
                {link ? <a>{page.value}</a> : page.value}
              </Ark.Item>
            ) : (
              <Ark.Ellipsis key={`e${i}`} index={i} />
            ),
          )
        }
      </Ark.Context>
      <Ark.NextTrigger asChild={link}>{link ? <a /> : null}</Ark.NextTrigger>
      {showEdges ? <Ark.LastTrigger asChild={link}>{link ? <a /> : null}</Ark.LastTrigger> : null}
      {children}
    </Ark.Root>
  )
}

/** 素の構造で組みたいとき用 */
Pagination.Root = Ark.Root
Pagination.Item = Ark.Item
Pagination.Ellipsis = Ark.Ellipsis
Pagination.FirstTrigger = Ark.FirstTrigger
Pagination.PrevTrigger = Ark.PrevTrigger
Pagination.NextTrigger = Ark.NextTrigger
Pagination.LastTrigger = Ark.LastTrigger
Pagination.Context = Ark.Context
