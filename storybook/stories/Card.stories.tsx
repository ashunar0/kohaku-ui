import type { Meta, StoryObj } from "@storybook/react-vite"
import { Actions, Badge, Button, Card, Group } from "@kohaku/react"

const meta = {
  title: "Layout/Card",
  component: Card.Root,
  argTypes: {
    elevated: { control: "boolean" },
    divided: { control: "boolean" },
  },
  render: (args) => (
    <Card.Root {...args} style={{ maxWidth: "24rem" }}>
      <Card.Header>
        <Card.Title>チームメンバー</Card.Title>
      </Card.Header>
      <Card.Body style={{ fontSize: ".875rem" }}>招待リンクは 7 日で失効します。</Card.Body>
      <Card.Footer>
        <Button variant="outline" size="sm">招待リンクを発行</Button>
      </Card.Footer>
    </Card.Root>
  ),
} satisfies Meta<typeof Card.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** 地から浮かせる。並べて置くカードは flat のままにする */
export const Elevated: Story = { args: { elevated: true } }

/** 既定は余白で区切る。線が要るときだけ divided */
export const Divided: Story = { args: { divided: true } }

/** 実際の画面に組んだところ */
export const InLayout: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr", maxWidth: "44rem" }}>
      {[
        ["Free", "個人で試す", "success", "公開中"],
        ["Pro", "チームで使う", "warning", "承認待ち"],
      ].map(([name, desc, v, label]) => (
        <Card.Root key={name as string}>
          <Card.Header>
            <Group>
              <Card.Title>{name as string}</Card.Title>
              <Badge variant={v as "success"}>{label as string}</Badge>
            </Group>
            <Card.Description>{desc as string}</Card.Description>
          </Card.Header>
          <Card.Footer>
            <Button size="sm" variant="outline">詳細</Button>
          </Card.Footer>
        </Card.Root>
      ))}
    </div>
  ),
}

/**
 * footer は既定で右寄せ。寄せ方を変えるときは中に Actions を置いて align を渡す
 * （Actions は footer の幅いっぱいに伸びる）。設定画面のように、見出しの左端にボタンをそろえたいとき用。
 */
export const FooterAlign: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
      {(["end", "start", "between"] as const).map((align) => (
        <Card.Root key={align}>
          <Card.Header>
            <Card.Title>align="{align}"</Card.Title>
            <Card.Description>すべての端末からログアウトします。</Card.Description>
          </Card.Header>
          <Card.Footer>
            <Actions align={align}>
              <Button variant="ghost" size="sm">やめる</Button>
              <Button variant="outline" size="sm">ログアウト</Button>
            </Actions>
          </Card.Footer>
        </Card.Root>
      ))}
    </div>
  ),
}
