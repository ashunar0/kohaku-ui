import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge, Steps } from "@kohaku/react"

/**
 * 決まった順番で進む段階と、いまどこまで進んだか（承認経路など）。表示するだけで操作は無い。
 *
 * Ark の Steps は入力を段階に分ける画面のための部品（読み上げではタブの並び）なので使わず、kohaku が持つ。
 * 状態は丸の形と色で示す: 完了 = 緑の塗り + ✓ / いま = 黄の輪 + 点 / 差し戻し = 赤の塗り + × / まだ = 灰の輪。
 * 済んだ段階から出る線だけ緑。丸は読み上げないので、状態の文字は中身に書く。
 * いまの段階には `aria-current="step"` が付く。
 */
const meta = {
  title: "Base/Steps",
  component: Steps,
} satisfies Meta<typeof Steps>

export default meta
type Story = StoryObj<typeof meta>

const variant = { 完了: "success", 承認待ち: "warning", 差し戻し: "danger", 未着手: undefined } as const

/** 段階名とバッジの行は高さを 1 行に固定し、バッジを段階名の行の中心にそろえる（丸も同じ行の中心） */
const row = (name: string, who: string, state: keyof typeof variant) => (
  <>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", height: "1lh" }}>
      <span>{name}</span>
      <Badge variant={variant[state]}>{state}</Badge>
    </div>
    <span style={{ fontSize: "var(--kh-text-sm)", color: "var(--kh-color-fg-muted)" }}>{who}</span>
  </>
)

/** 承認経路。状態はバッジで右端に、担当者と日付を 2 行目に置く */
export const Default: Story = {
  render: () => (
    <Steps style={{ maxWidth: "20rem" }}>
      <Steps.Item state="done">{row("申請", "山田 太郎・2026/11/10", "完了")}</Steps.Item>
      <Steps.Item state="done">{row("部署承認", "中村 ひかり・2026/11/10", "完了")}</Steps.Item>
      <Steps.Item state="current">{row("経理承認", "あさひ", "承認待ち")}</Steps.Item>
    </Steps>
  ),
}

/** 4 つの状態。差し戻しの先はまだ（灰の線） */
export const States: Story = {
  render: () => (
    <Steps style={{ maxWidth: "20rem" }}>
      <Steps.Item state="done">申請（完了）</Steps.Item>
      <Steps.Item state="rejected">部署承認（差し戻し）</Steps.Item>
      <Steps.Item state="current">経理承認（承認待ち）</Steps.Item>
      <Steps.Item state="waiting">支払（未着手）</Steps.Item>
    </Steps>
  ),
}
