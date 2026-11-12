import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge, HStack, Tag } from "@kohaku/react"

/**
 * 選んだ値を示す札（freee Vibes の TagBox と同じ形）。onRemove を渡すと外すボタンが出る。
 * 状態を示すだけで外さないものは Badge。形から変えて、押せる札と見分けられるようにしている。
 */
const meta = {
  title: "Base/Tag",
  component: Tag,
  args: { type: "状態", children: "承認待ち" },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { onRemove: () => {} } }

/** 種別あり / なし、外せる / 外せない。hover と focus は外すボタンで確かめる */
export const States: Story = {
  render: () => (
    <HStack>
      <Tag type="状態" onRemove={() => {}}>承認待ち</Tag>
      <Tag onRemove={() => {}}>タクシー</Tag>
      <Tag type="期間">11/1〜11/30</Tag>
      <Tag>外せない札</Tag>
    </HStack>
  ),
}

/** 絞り込みで適用中の条件。表の状態（Badge）とは形で見分ける */
export const WithBadge: Story = {
  render: () => (
    <HStack gap={4}>
      <HStack>
        <Tag type="状態" onRemove={() => {}}>承認待ち</Tag>
        <Tag type="部署" onRemove={() => {}}>営業部</Tag>
      </HStack>
      <HStack>
        <Badge variant="warning">承認待ち</Badge>
        <Badge variant="success">承認済み</Badge>
      </HStack>
    </HStack>
  ),
}
