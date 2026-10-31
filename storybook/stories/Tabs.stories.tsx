import type { Meta, StoryObj } from "@storybook/react-vite"
import { Tabs } from "@kohaku/react"

const meta = {
  title: "Navigation/Tabs",
  component: Tabs.Root,
} satisfies Meta<typeof Tabs.Root>

export default meta
type Story = StoryObj<typeof meta>

const panel = { margin: 0, fontSize: ".875rem" }

/**
 * 同じものの別の面（概要・メンバー・請求）を切り替える。
 * 絞り込みや、同じものの状態の切り替えには使わない（それは Segmented Control の役割）。
 *
 * Ark を再輸出しているだけで、kohaku が隠している部品は無い。
 */
export const Default: Story = {
  render: () => (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">概要</Tabs.Trigger>
        <Tabs.Trigger value="members">メンバー</Tabs.Trigger>
        <Tabs.Trigger value="billing">請求</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview"><p style={panel}>組織の基本情報と、契約中のプランを表示します。</p></Tabs.Content>
      <Tabs.Content value="members"><p style={panel}>招待済みのメンバーは 12 人です。</p></Tabs.Content>
      <Tabs.Content value="billing"><p style={panel}>次回の請求日は 11 月 25 日です。</p></Tabs.Content>
    </Tabs.Root>
  ),
}

/**
 * 選択中・未選択・無効。選択中の印は trigger 自身の下線（2px・accent）。
 * ツールバーでテーマを切り替えると、下線と文字色だけが反転する。
 */
export const States: Story = {
  render: () => (
    <Tabs.Root defaultValue="selected">
      <Tabs.List>
        <Tabs.Trigger value="selected">選択中</Tabs.Trigger>
        <Tabs.Trigger value="idle">未選択</Tabs.Trigger>
        <Tabs.Trigger value="disabled" disabled>無効</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="selected"><p style={panel}>←→ キーでタブを移動できる。</p></Tabs.Content>
      <Tabs.Content value="idle"><p style={panel}>未選択のタブの内容。</p></Tabs.Content>
    </Tabs.Root>
  ),
}

/** 入りきらないときは折り返さず、横にスクロールする */
export const Overflow: Story = {
  render: () => (
    <div style={{ maxWidth: "20rem" }}>
      <Tabs.Root defaultValue="t0">
        <Tabs.List>
          {["概要", "メンバー", "請求", "連携", "通知", "セキュリティ", "監査ログ"].map((label, i) => (
            <Tabs.Trigger key={label} value={`t${i}`}>{label}</Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </div>
  ),
}
