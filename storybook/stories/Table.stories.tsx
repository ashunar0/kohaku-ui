import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge, Checkbox, HStack, Icon, IconButton, Switch, Table, Tooltip } from "@kohaku/react"
import { useState } from "react"

const rows = [
  { id: "EX-1042", date: "11/10", name: "佐藤 美咲", dept: "営業部", cat: "交通費", amount: "¥12,800", status: "承認待ち", v: "warning" as const },
  { id: "EX-1041", date: "11/09", name: "田中 健太", dept: "開発部", cat: "会議費", amount: "¥3,240", status: "承認済み", v: "success" as const },
  { id: "EX-1040", date: "11/08", name: "鈴木 大輔", dept: "マーケティング部", cat: "広告宣伝費", amount: "¥48,000", status: "差し戻し", v: "danger" as const },
  { id: "EX-1039", date: "11/07", name: "高橋 由美", dept: "人事部", cat: "消耗品費", amount: "¥1,980", status: "下書き", v: "neutral" as const },
]

const More = ({ label }: { label: string }) => (
  <IconButton size="sm" variant="ghost" label={label}>
    <Icon><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></Icon>
  </IconButton>
)

const meta = {
  title: "Data/Table",
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

/** 中身は素の thead / tr / td。数値の列は data-numeric、縮める列は data-fit */
export const Default: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th scope="col" data-fit>申請番号</th>
          <th scope="col">科目</th>
          <th scope="col" data-numeric>金額</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td data-fit>{r.id}</td>
            <td>{r.cat}</td>
            <td data-numeric>{r.amount}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
}

/**
 * 実際の一覧に組んだところ。行の高さは padding でなく高さで決めているので、
 * 2 段のセル・チェックボックス・ボタンが入っても全行 48px にそろう。
 * 行ごとの操作はボタンを並べず「…」1 つにまとめる
 */
export const InList: Story = {
  render: function Render() {
    const [picked, setPicked] = useState<string[]>(["EX-1041"])
    const all = picked.length === rows.length
    return (
      <Table>
        <thead>
          <tr>
            <th scope="col">
              <Checkbox
                aria-label="すべて選択"
                checked={all ? true : picked.length > 0 ? "indeterminate" : false}
                onCheckedChange={(d) => setPicked(d.checked ? rows.map((r) => r.id) : [])}
              />
            </th>
            <th scope="col" data-fit>申請番号</th>
            <th scope="col" data-fit>申請日</th>
            <th scope="col">申請者</th>
            <th scope="col">科目</th>
            <th scope="col" data-numeric>金額</th>
            <th scope="col" data-fit>状態</th>
            <th scope="col" data-fit><span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>操作</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} data-selected={picked.includes(r.id) ? "" : undefined}>
              <td>
                <Checkbox
                  aria-label={`${r.id} を選択`}
                  checked={picked.includes(r.id)}
                  onCheckedChange={(d) => setPicked((p) => (d.checked ? [...p, r.id] : p.filter((x) => x !== r.id)))}
                />
              </td>
              <td data-fit>{r.id}</td>
              <td data-fit>{r.date}</td>
              <td>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <strong>{r.name}</strong>
                  <small style={{ fontSize: "var(--kh-text-sm)", color: "var(--kh-color-fg-muted)" }}>{r.dept}</small>
                </span>
              </td>
              <td>{r.cat}</td>
              <td data-numeric>{r.amount}</td>
              <td data-fit><Badge variant={r.v}>{r.status}</Badge></td>
              <td data-fit><More label={`${r.id} の操作`} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  },
}

/** 行の状態。上から 通常 / 選択中（data-selected）。ホバーは通常の行に乗せて確かめる */
export const States: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th scope="col"><Checkbox aria-label="すべて選択" checked="indeterminate" /></th>
          <th scope="col">状態</th>
          <th scope="col" data-numeric>金額</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><Checkbox aria-label="通常の行を選択" /></td>
          <td>通常</td>
          <td data-numeric>¥12,800</td>
        </tr>
        <tr data-selected="">
          <td><Checkbox aria-label="選択中の行を選択" defaultChecked /></td>
          <td>選択中（data-selected）</td>
          <td data-numeric>¥3,240</td>
        </tr>
      </tbody>
    </Table>
  ),
}

/** 該当なしの表。行に data-empty を付け、1 つのセルで全列をまたぐ。ホバーの地は付かない */
export const Empty: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th scope="col" data-fit>申請番号</th>
          <th scope="col">科目</th>
          <th scope="col" data-numeric>金額</th>
        </tr>
      </thead>
      <tbody>
        <tr data-empty="">
          <td colSpan={3}>条件に合う申請はありません。</td>
        </tr>
      </tbody>
    </Table>
  ),
}

/** 集計表。行の頭は <th scope="row">（太字にしない）、合計の行は <tfoot>（表頭と同じ地で表を閉じる） */
export const Totals: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th scope="col">部署</th>
          <th scope="col" data-numeric>件数</th>
          <th scope="col" data-numeric>金額</th>
        </tr>
      </thead>
      <tbody>
        <tr><th scope="row">マーケティング</th><td data-numeric>9</td><td data-numeric>¥1,284,000</td></tr>
        <tr><th scope="row">営業部</th><td data-numeric>18</td><td data-numeric>¥412,300</td></tr>
        <tr><th scope="row">開発部</th><td data-numeric>24</td><td data-numeric>¥298,640</td></tr>
      </tbody>
      <tfoot>
        <tr><th scope="row">合計</th><td data-numeric>51</td><td data-numeric>¥1,994,940</td></tr>
      </tfoot>
    </Table>
  ),
}

const Help = ({ label, text }: { label: string; text: string }) => (
  <Tooltip.Root openDelay={200}>
    <Tooltip.Trigger asChild>
      <IconButton size="xs" variant="ghost" label={`「${label}」の説明`}>
        <Icon><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></Icon>
      </IconButton>
    </Tooltip.Trigger>
    <Tooltip.Content>{text}</Tooltip.Content>
  </Tooltip.Root>
)

/**
 * 列の幅と揃え。既定はブラウザが中身の長さに応じて余りを配る。表ごとに次で決める。
 *
 * - `data-fit` 中身ぴったり（余りをもらわない）
 * - `style={{ width: "30%" }}` 余りの取り分（割合でも rem でも）
 * - `data-align="center" | "end"` 揃え（数字は `data-numeric`）。セルの中の箱（ラベルなしの Switch）も寄る
 * - セルの中で文字とアイコンを並べるときは `HStack`（セルの揃えに従う）
 *
 * **空きは揃えの反対側に出る。** 左寄せの列と右寄せの列が隣り合うときは、右寄せの列を `data-fit` にする
 * （空きが数字の左に出ると、左隣の列が広く・数字が右隣に詰まって見える）
 */
export const Columns: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th scope="col" style={{ width: "30%" }}>科目名</th>
          <th scope="col" style={{ width: "30%" }}>税区分</th>
          <th scope="col" data-numeric data-fit>
            <HStack gap={1} wrap={false}>上限額<Help label="上限額" text="上限額を超える申請には、承認時に警告が表示されます。" /></HStack>
          </th>
          <th scope="col" data-align="center" style={{ width: "20%" }}>
            <HStack gap={1} wrap={false}>有効<Help label="有効" text="無効にした科目は、経費申請で選択できなくなります。" /></HStack>
          </th>
          <th scope="col" data-fit>操作</th>
        </tr>
      </thead>
      <tbody>
        {[["交通費", "課税仕入 10%", "—"], ["宿泊費", "課税仕入 10%", "¥15,000"], ["新聞図書費", "課税仕入 8%（軽減）", "—"]].map(([n, t, l]) => (
          <tr key={n}>
            <th scope="row">{n}</th>
            <td>{t}</td>
            <td data-numeric data-fit>{l}</td>
            <td data-align="center"><Switch defaultChecked aria-label={`${n} を有効にする`} /></td>
            <td data-fit><More label={`${n} の操作`} /></td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
}

/** 行と表頭の高さは L3 トークンで寄せられる。祖先に置けば中の表がまとめて変わる */
export const Compact: Story = {
  render: () => (
    <div style={{ ["--kh-table-row-height" as string]: "2.5rem", ["--kh-table-head-height" as string]: "2.25rem" }}>
      <Table>
        <thead>
          <tr>
            <th scope="col" data-fit>申請番号</th>
            <th scope="col">科目</th>
            <th scope="col" data-numeric>金額</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td data-fit>{r.id}</td>
              <td>{r.cat}</td>
              <td data-numeric>{r.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  ),
}
