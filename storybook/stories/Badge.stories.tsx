import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge, Group } from "@kohaku/react"

const meta = {
  title: "Base/Badge",
  component: Badge,
  args: { children: "公開中" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["neutral", "outline", "accent", "danger", "warning", "success", "info"],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <Group>
      <Badge>neutral</Badge>
      <Badge variant="outline">outline</Badge>
      <Badge variant="accent">accent</Badge>
      <Badge variant="success">公開中</Badge>
      <Badge variant="warning">承認待ち</Badge>
      <Badge variant="danger">停止中</Badge>
      <Badge variant="info">ベータ</Badge>
    </Group>
  ),
}
