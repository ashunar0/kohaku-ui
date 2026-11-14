import { useState, type Dispatch, type SetStateAction } from "react"
import { Badge, Button, Link, Table, Tabs, VStack, VisuallyHidden } from "@kohaku/react"
import { formatDate } from "./data"

/* 通知の一覧（#/notifications）。日付ごとに区切った一覧より、日時を列にした表のほうが
   内容の頭がそろう（あさひが表を選んだ）ので Table で組む */

type Kind = "request" | "rejected" | "approved" | "system"
const kindLabel: Record<Kind, string> = { request: "承認依頼", rejected: "差し戻し", approved: "承認", system: "お知らせ" }
const kindVariant = { request: "warning", rejected: "danger", approved: "success", system: "neutral" } as const

export type Notice = { id: string; at: string; kind: Kind; text: string; ref?: string; unread: boolean }

export const initialNotices: Notice[] = [
  { id: "n1", at: "2026-11-14T10:24", kind: "request", text: "山田 太郎さんから承認依頼が届きました", ref: "EX-2026-1043", unread: true },
  { id: "n2", at: "2026-11-14T09:02", kind: "request", text: "佐藤 めぐみさんから承認依頼が届きました", ref: "EX-2026-1042", unread: true },
  { id: "n3", at: "2026-11-13T17:45", kind: "approved", text: "田中 彩さんが申請を承認しました", ref: "EX-2026-1040", unread: true },
  { id: "n4", at: "2026-11-13T11:10", kind: "rejected", text: "高橋 健さんが申請を差し戻しました", ref: "EX-2026-1037", unread: false },
  { id: "n5", at: "2026-11-12T18:30", kind: "system", text: "11 月 20 日 2:00〜4:00 にメンテナンスを実施します", unread: false },
  { id: "n6", at: "2026-11-12T08:55", kind: "request", text: "伊藤 さくらさんから承認依頼が届きました", ref: "EX-2026-1038", unread: false },
  { id: "n7", at: "2026-11-10T15:20", kind: "approved", text: "中村 ひかりさんが申請を承認しました", ref: "EX-2026-1036", unread: false },
]

/* 未読の数はヘッダーのベルにも出すので、一覧は App が持つ */
export function NotificationsPage({ items, setItems }: { items: Notice[]; setItems: Dispatch<SetStateAction<Notice[]>> }) {
  const [tab, setTab] = useState("all")

  const shown = tab === "unread" ? items.filter((n) => n.unread) : items
  const unread = items.filter((n) => n.unread).length

  const read = (id: string) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, unread: false } : x)))

  return (
    <VStack gap={1} className="page notifications">
      <header className="page-head" data-kh="hstack" data-justify="between" data-gap="4">
        <h1>通知</h1>
        <Button variant="outline" disabled={!unread} onClick={() => setItems((xs) => xs.map((x) => ({ ...x, unread: false })))}>
          すべて既読にする
        </Button>
      </header>

      <Tabs.Root value={tab} onValueChange={(d) => setTab(d.value)}>
        <Tabs.List>
          <Tabs.Trigger value="all">すべて</Tabs.Trigger>
          <Tabs.Trigger value="unread">未読（{unread}）</Tabs.Trigger>
        </Tabs.List>
        {["all", "unread"].map((v) => (
          <Tabs.Content key={v} value={v}>
            <Table>
              <thead>
                <tr>
                  <th scope="col" data-fit><VisuallyHidden>未読</VisuallyHidden></th>
                  <th scope="col" data-fit>日時</th>
                  <th scope="col" data-fit>種別</th>
                  <th scope="col">内容</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((n) => (
                  <tr key={n.id}>
                    <td data-fit><span className="notice-dot" data-unread={n.unread ? "" : undefined}>{n.unread ? <VisuallyHidden>未読</VisuallyHidden> : null}</span></td>
                    <td data-fit className="notice-at"><time dateTime={n.at}>{formatDate(n.at.slice(0, 10))} {n.at.slice(11)}</time></td>
                    <td data-fit><Badge variant={kindVariant[n.kind]}>{kindLabel[n.kind]}</Badge></td>
                    <td>
                      {n.text}
                      {n.ref ? (
                        <>
                          {"（"}
                          <Link href={`#/expenses/${n.ref}`} onClick={() => read(n.id)}>{n.ref}</Link>
                          {"）"}
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
                {shown.length === 0 ? (
                  <tr data-empty="">
                    <td colSpan={4}>未読の通知はありません。</td>
                  </tr>
                ) : null}
              </tbody>
            </Table>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </VStack>
  )
}
