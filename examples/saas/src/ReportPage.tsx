import { useState } from "react"
import {
  Actions,
  Button,
  Icon,
  Progress,
  Select,
  Table,
  Tabs,
  VStack,
  createListCollection,
} from "@kohaku/react"
import { Download } from "lucide-react"
import { yen } from "./data"

/* レポート（#/reports）。合計の行がある表・数字の列・表の中の Progress・期間の切り替えで
   kohaku の穴を探すための画面 */

const months = createListCollection({
  items: [
    { label: "2026年11月", value: "2026-11" },
    { label: "2026年10月", value: "2026-10" },
    { label: "2026年9月", value: "2026-09" },
  ],
})

type Row = { name: string; count: number; amount: number; prev: number }

/* examples なので月ごとに決まった数字を返す */
const byDept: Record<string, Row[]> = {
  "2026-11": [
    { name: "営業部", count: 18, amount: 412_300, prev: 386_900 },
    { name: "開発部", count: 24, amount: 298_640, prev: 315_200 },
    { name: "マーケティング", count: 9, amount: 1_284_000, prev: 1_120_000 },
    { name: "コーポレート", count: 12, amount: 186_420, prev: 186_420 },
    { name: "経理部", count: 4, amount: 23_800, prev: 31_500 },
  ],
  "2026-10": [
    { name: "営業部", count: 16, amount: 386_900, prev: 402_100 },
    { name: "開発部", count: 27, amount: 315_200, prev: 288_000 },
    { name: "マーケティング", count: 8, amount: 1_120_000, prev: 980_000 },
    { name: "コーポレート", count: 11, amount: 186_420, prev: 172_300 },
    { name: "経理部", count: 5, amount: 31_500, prev: 28_700 },
  ],
  "2026-09": [
    { name: "営業部", count: 17, amount: 402_100, prev: 377_000 },
    { name: "開発部", count: 22, amount: 288_000, prev: 301_400 },
    { name: "マーケティング", count: 7, amount: 980_000, prev: 1_050_000 },
    { name: "コーポレート", count: 10, amount: 172_300, prev: 165_800 },
    { name: "経理部", count: 4, amount: 28_700, prev: 30_200 },
  ],
}

const byCategory: Record<string, Row[]> = {
  "2026-11": [
    { name: "広告費", count: 6, amount: 1_100_000, prev: 950_000 },
    { name: "外注費", count: 3, amount: 360_000, prev: 420_000 },
    { name: "交通費", count: 31, amount: 186_540, prev: 172_300 },
    { name: "接待交際費", count: 8, amount: 214_300, prev: 198_600 },
    { name: "宿泊費", count: 7, amount: 98_400, prev: 112_000 },
    { name: "備品", count: 5, amount: 141_220, prev: 96_400 },
    { name: "書籍", count: 7, amount: 104_700, prev: 90_720 },
  ],
  "2026-10": [
    { name: "広告費", count: 5, amount: 950_000, prev: 880_000 },
    { name: "外注費", count: 4, amount: 420_000, prev: 300_000 },
    { name: "交通費", count: 29, amount: 172_300, prev: 181_900 },
    { name: "接待交際費", count: 7, amount: 198_600, prev: 176_000 },
    { name: "宿泊費", count: 8, amount: 112_000, prev: 98_000 },
    { name: "備品", count: 4, amount: 96_400, prev: 128_000 },
    { name: "書籍", count: 10, amount: 90_720, prev: 106_520 },
  ],
  "2026-09": [
    { name: "広告費", count: 5, amount: 880_000, prev: 900_000 },
    { name: "外注費", count: 3, amount: 300_000, prev: 350_000 },
    { name: "交通費", count: 30, amount: 181_900, prev: 170_200 },
    { name: "接待交際費", count: 6, amount: 176_000, prev: 190_000 },
    { name: "宿泊費", count: 7, amount: 98_000, prev: 101_200 },
    { name: "備品", count: 3, amount: 128_000, prev: 110_000 },
    { name: "書籍", count: 6, amount: 107_200, prev: 103_000 },
  ],
}

const pct = (n: number) => `${(n * 100).toFixed(1)}%`
const diff = (now: number, prev: number) => {
  if (prev === 0) return "—"
  const d = (now - prev) / prev
  if (Math.abs(d) < 0.0005) return "±0.0%"
  return `${d > 0 ? "+" : "−"}${(Math.abs(d) * 100).toFixed(1)}%`
}

function ReportTable({ head, rows }: { head: string; rows: Row[] }) {
  const sorted = [...rows].sort((a, b) => b.amount - a.amount)
  const total = rows.reduce((s, r) => s + r.amount, 0)
  const count = rows.reduce((s, r) => s + r.count, 0)
  const prev = rows.reduce((s, r) => s + r.prev, 0)
  return (
    <Table>
      <thead>
        <tr>
          <th scope="col">{head}</th>
          <th scope="col" data-numeric>件数</th>
          <th scope="col" data-numeric>金額</th>
          <th scope="col">構成比</th>
          <th scope="col" data-numeric>前月比</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((r) => (
          <tr key={r.name}>
            <th scope="row">{r.name}</th>
            <td data-numeric>{r.count}</td>
            <td data-numeric>{yen(r.amount)}</td>
            <td>
              <Progress value={(r.amount / total) * 100} showValue aria-label={`${r.name} の構成比`} className="share" />
            </td>
            <td data-numeric>{diff(r.amount, r.prev)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">合計</th>
          <td data-numeric>{count}</td>
          <td data-numeric>{yen(total)}</td>
          <td>{pct(1)}</td>
          <td data-numeric>{diff(total, prev)}</td>
        </tr>
      </tfoot>
    </Table>
  )
}

export function ReportPage() {
  const [month, setMonth] = useState(["2026-11"])

  return (
    <VStack gap={4} className="page">
      <header className="page-head" data-kh="hstack" data-justify="between" data-gap="4">
        <h1>レポート</h1>
        <Actions>
          <Select.Root collection={months} value={month} onValueChange={(d) => setMonth(d.value)} className="report-month">
            <Select.Trigger aria-label="対象月">
              <Select.ValueText />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Content>
              {months.items.map((m) => (
                <Select.Item key={m.value} item={m}>
                  <Select.ItemText>{m.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Button variant="outline">
            <Icon asChild><Download /></Icon>
            CSV 出力
          </Button>
        </Actions>
      </header>

      <Tabs.Root defaultValue="dept">
        <Tabs.List>
          <Tabs.Trigger value="dept">部署別</Tabs.Trigger>
          <Tabs.Trigger value="category">科目別</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="dept">
          <ReportTable head="部署" rows={byDept[month[0]]} />
        </Tabs.Content>
        <Tabs.Content value="category"><ReportTable head="科目" rows={byCategory[month[0]]} /></Tabs.Content>
      </Tabs.Root>
    </VStack>
  )
}
