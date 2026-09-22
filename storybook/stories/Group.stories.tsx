import type { Meta, StoryObj } from "@storybook/react-vite"
import { Actions, Button, Group, Input } from "@kohaku/react"

const meta = {
  title: "Layout/Group",
  component: Group,
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    attached: { control: "boolean" },
  },
  decorators: [(Story) => <div style={{ maxWidth: "28rem" }}><Story /></div>],
} satisfies Meta<typeof Group>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Group {...args}>
      <Input placeholder="you@example.com" />
      <Button>招待する</Button>
    </Group>
  ),
}

/** 隙間なく連結する。角丸は外側だけ残る */
export const Attached: Story = {
  args: { attached: true },
  render: (args) => (
    <Group {...args}>
      <Input placeholder="キーワードで検索" />
      <Button variant="outline">検索</Button>
    </Group>
  ),
}

/** Group に size を置くと中身が一括で揃う */
export const SizeCascade: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".75rem" }}>
      {(["sm", "md", "lg"] as const).map((s) => (
        <Group key={s} size={s}>
          <Input placeholder={s} />
          <Button>送信</Button>
        </Group>
      ))}
    </div>
  ),
}

/** 操作の行。既定は右寄せ */
export const ActionsRow: StoryObj = {
  name: "Actions",
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Actions>
        <Button variant="outline">キャンセル</Button>
        <Button>保存する</Button>
      </Actions>
      <Actions align="between">
        <Button variant="ghost">削除</Button>
        <Button>保存する</Button>
      </Actions>
    </div>
  ),
}
