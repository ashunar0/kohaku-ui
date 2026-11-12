import type { Meta, StoryObj } from "@storybook/react-vite"
import { Card, Spinner } from "@kohaku/react"

/**
 * 読み込み中を示す。動きは freee Vibes と同じ（弧が伸び縮みしながら回る）。色は accent（P7）。
 * role="status" と、画面に出ない読み上げの文言（既定「読み込み中」）を持つ。
 * 動きを減らす設定では、伸び縮みをやめてゆっくり回る。
 */
const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg"] } },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** 大きさ。sm 16 / md 24 / lg 32px */
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
    </div>
  ),
}

/** 文字の横。読み上げの文言は label で変えられる */
export const WithText: Story = {
  render: () => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--kh-color-fg-muted)" }}>
      <Spinner size="sm" label="申請の一覧を読み込み中" />読み込み中…
    </span>
  ),
}

export const InCard: Story = {
  render: () => (
    <Card.Root style={{ maxWidth: "24rem" }}>
      <Card.Header><Card.Title>経費申請</Card.Title></Card.Header>
      <Card.Body style={{ display: "grid", placeItems: "center", height: "8rem" }}>
        <Spinner size="lg" />
      </Card.Body>
    </Card.Root>
  ),
}
