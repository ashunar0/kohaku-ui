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
    </div>
  ),
}
