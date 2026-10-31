import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, Tooltip } from "@kohaku/react"

const meta = {
  title: "Overlay/Tooltip",
  component: Tooltip.Root,
} satisfies Meta<typeof Tooltip.Root>

export default meta
type Story = StoryObj<typeof meta>

/**
 * ホバー・フォーカスで出る短い補足。操作に要る情報（入力のルール・エラー）は入れない。
 * 隠れているので気づかれないため。
 *
 * `@kohaku/react` の Tooltip は `interactive` の既定が true。Tooltip の上にポインタを
 * 移しても閉じない（WCAG 1.4.13）。Ark を直接使うときは自分で `interactive` を付ける。
 */
export const Default: Story = {
  render: () => (
    <div style={{ paddingBlock: "3rem" }}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button variant="outline">エクスポート</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>CSV でダウンロード</Tooltip.Content>
      </Tooltip.Root>
    </div>
  ),
}

/**
 * 白地に線だけ。影は使わない。ツールバーでテーマを切り替えて確認できる。
 * 長い文は最大幅（16rem）で折り返す。
 */
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center", paddingBlock: "3rem 6rem" }}>
      <Tooltip.Root open positioning={{ placement: "top" }}>
        <Tooltip.Trigger asChild>
          <Button variant="outline">1 行</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>CSV でダウンロード</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root open positioning={{ placement: "bottom" }}>
        <Tooltip.Trigger asChild>
          <Button variant="ghost">折り返し</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          メンバーを招待するには管理者の権限が必要です。権限は組織の設定から変更できます。
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  ),
}
