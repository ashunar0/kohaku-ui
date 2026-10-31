import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, Checkbox, Popover } from "@kohaku/react"

const meta = {
  title: "Overlay/Popover",
  component: Popover.Root,
} satisfies Meta<typeof Popover.Root>

export default meta
type Story = StoryObj<typeof meta>

const body = (
  <>
    <Popover.Title>表示する列</Popover.Title>
    <Popover.Description>一覧に出す列を選んでください。</Popover.Description>
    <div style={{ display: "grid", gap: ".5rem", marginTop: ".75rem" }}>
      <Checkbox defaultChecked>氏名</Checkbox>
      <Checkbox defaultChecked>メールアドレス</Checkbox>
      <Checkbox>最終ログイン</Checkbox>
    </div>
  </>
)

/**
 * クリックで開き、中で操作できる面。Esc・外のクリックで閉じ、フォーカスはボタンに戻る。
 * 読むだけの短い補足なら Tooltip。
 */
export const Default: Story = {
  render: () => (
    <Popover.Root positioning={{ placement: "bottom-start" }}>
      <Popover.Trigger asChild>
        <Button variant="outline">表示項目</Button>
      </Popover.Trigger>
      <Popover.Content>{body}</Popover.Content>
    </Popover.Root>
  ),
}

/** Select の選択肢と同じ面（線＋shadow-lg）。ツールバーでテーマを切り替えて確認できる */
export const States: Story = {
  render: () => (
    <div style={{ paddingBottom: "12rem" }}>
      <Popover.Root open positioning={{ placement: "bottom-start" }} closeOnInteractOutside={false}>
        <Popover.Trigger asChild>
          <Button variant="outline">開いた状態</Button>
        </Popover.Trigger>
        <Popover.Content>{body}</Popover.Content>
      </Popover.Root>
    </div>
  ),
}
