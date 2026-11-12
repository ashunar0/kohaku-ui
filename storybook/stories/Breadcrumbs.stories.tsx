import type { Meta, StoryObj } from "@storybook/react-vite"
import { Breadcrumbs } from "@kohaku/react"

const meta = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item href="#">ホーム</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">経費申請</Breadcrumbs.Item>
      <Breadcrumbs.Item current>EX-1042</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}

/** 項目の状態。リンク / 現在地（current）。下線は hover のときだけ出る。focus は Tab で確かめる */
export const States: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item href="#">リンク</Breadcrumbs.Item>
      <Breadcrumbs.Item current>現在地（current）</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}

/** 長くなったら改行する。項目の途中でも折り返す */
export const Wrap: Story = {
  render: () => (
    <Breadcrumbs style={{ maxWidth: "20rem" }}>
      <Breadcrumbs.Item href="#">ホーム</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">組織の設定</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">部署とメンバー</Breadcrumbs.Item>
      <Breadcrumbs.Item current>マーケティング部の承認ルート</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}

/** ルーターの Link を使うときは href を渡さず中に書く。出てくる <a> に同じ見た目が当たる */
export const WithRouterLink: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumbs.Item><a href="#" onClick={(e) => e.preventDefault()}>ホーム</a></Breadcrumbs.Item>
      <Breadcrumbs.Item current>経費申請</Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}
