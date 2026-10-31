import type { Meta, StoryObj } from "@storybook/react-vite"
import { Collapsible } from "@kohaku/react"

const meta = {
  title: "Layout/Collapsible",
  component: Collapsible.Root,
} satisfies Meta<typeof Collapsible.Root>

export default meta
type Story = StoryObj<typeof meta>

const text = { margin: 0, paddingTop: ".5rem", fontSize: ".875rem" }

/**
 * 1 つの領域を開け閉めする。Ark を再輸出しているだけ。
 * Indicator を空で置くとシェブロンを kohaku が描く（<svg> を入れれば差し替わる）。
 */
export const Default: Story = {
  render: () => (
    <Collapsible.Root>
      <Collapsible.Trigger>詳細な条件<Collapsible.Indicator /></Collapsible.Trigger>
      <Collapsible.Content>
        <p style={text}>登録日・最終ログイン・所属部署で絞り込めます。</p>
      </Collapsible.Content>
    </Collapsible.Root>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <Collapsible.Root>
        <Collapsible.Trigger>閉じている<Collapsible.Indicator /></Collapsible.Trigger>
        <Collapsible.Content><p style={text}>中身</p></Collapsible.Content>
      </Collapsible.Root>
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>開いている<Collapsible.Indicator /></Collapsible.Trigger>
        <Collapsible.Content><p style={text}>開いた状態の中身です。</p></Collapsible.Content>
      </Collapsible.Root>
      <Collapsible.Root disabled>
        <Collapsible.Trigger>無効<Collapsible.Indicator /></Collapsible.Trigger>
        <Collapsible.Content><p style={text}>中身</p></Collapsible.Content>
      </Collapsible.Root>
    </div>
  ),
}
