import type { Meta, StoryObj } from "@storybook/react-vite"
import { Progress } from "@kohaku/react"

const meta = {
  title: "Feedback/Progress",
  component: Progress,
  args: { label: "アップロード中", showValue: true, defaultValue: 40 },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 線形だけ。value を渡さないと「終わりが分からない読み込み中」になる。
 *
 * Ark は role="progressbar" の名前を値（"40%"）にするので、`@kohaku/react` は
 * Track を label に結び付けている。Ark を直接使うときは Track に `aria-labelledby` を付ける。
 */
export const Default: Story = {}

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.25rem", maxWidth: "28rem" }}>
      <Progress label="進行中" showValue defaultValue={40} />
      <Progress label="完了" showValue defaultValue={100} />
      <Progress label="終わりが分からない読み込み中" defaultValue={null} />
      <Progress aria-label="ラベルを出さない場合" defaultValue={70} />
      <Progress aria-label="ラベルを出さずに数字を出す場合" showValue defaultValue={58.2} formatOptions={{ style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }} />
    </div>
  ),
}

/** ラベルを出さずに数字を出すと、数字が棒の右に来て 1 行になる（表の中の構成比など）。数字の幅は固定で、行が変わっても棒の長さがそろう */
export const InTable: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: "16rem" }}>
      {[58.2, 18.7, 1.1].map((v) => (
        <Progress key={v} aria-label="構成比" showValue defaultValue={v} formatOptions={{ style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }} />
      ))}
    </div>
  ),
}
