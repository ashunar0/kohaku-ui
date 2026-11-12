import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, Group, Icon } from "@kohaku/react"

const Save = () => (
  <Icon>
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
    <path d="M7 3v4a1 1 0 0 0 1 1h7" />
  </Icon>
)

const meta = {
  title: "Base/Button",
  component: Button,
  args: { children: "保存する" },
  argTypes: {
    variant: { control: "inline-radio", options: ["solid", "outline", "ghost", "danger"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <Group>
      <Button>solid</Button>
      <Button variant="outline">outline</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="danger">danger</Button>
    </Group>
  ),
}

/** 36 / 40 / 44px。既定は md。モバイルで sm 以下は使わない */
export const Sizes: Story = {
  render: () => (
    <Group>
      <Button size="xs">xs</Button>
      <Button size="sm">sm</Button>
      <Button size="md">md</Button>
      <Button size="lg">lg</Button>
    </Group>
  ),
}

/**
 * アイコンは kohaku が持たない。利用側が Lucide 等から差す。
 * サイズと位置だけ CSS が管理する（和文の ink 中心に合わせる補正込み）。
 */
export const WithIcon: Story = {
  render: () => (
    <Group>
      <Button><Save />保存する</Button>
      <Button variant="outline" size="sm"><Save />下書き保存</Button>
    </Group>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
