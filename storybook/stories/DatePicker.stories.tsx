import type { Meta, StoryObj } from "@storybook/react-vite"
import { DatePicker, parseDate } from "@kohaku/react"

const meta = {
  title: "Form/DatePicker",
  component: DatePicker,
  args: { label: "申請日" },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 入力欄とカレンダーの組み立ては隠れている。日本語・日曜始まりが既定。
 * 打ち込んだ日付は「2026/12/05」の形に整えられる
 */
export const Default: Story = {}

/** 範囲は 1 つの枠に入力欄を 2 つ並べて「〜」でつなぐ */
export const Range: Story = {
  args: {
    label: "期間",
    selectionMode: "range",
    defaultValue: [parseDate("2026-11-03"), parseDate("2026-11-13")],
  },
}

/**
 * カレンダーの状態。選んだ日は塗り、今日は線、範囲は帯。
 * 前後の月の日付は出さない。min / max の外は薄くなって選べない
 */
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", justifyItems: "start" }}>
      <DatePicker
        label="範囲・今日を含む・期限あり（11/20 まで）"
        selectionMode="range"
        defaultValue={[parseDate("2026-11-03"), parseDate("2026-11-13")]}
        max={parseDate("2026-11-20")}
        defaultOpen
        closeOnSelect={false}
      />
      <div style={{ height: "18rem" }} />
      <DatePicker label="読み取り専用" readOnly defaultValue={[parseDate("2026-11-03")]} />
      <DatePicker label="無効" disabled defaultValue={[parseDate("2026-11-03")]} />
      <DatePicker label="エラー" invalid defaultValue={[parseDate("2026-11-03")]} />
    </div>
  ),
}
