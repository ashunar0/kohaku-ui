import type { Meta, StoryObj } from "@storybook/react-vite"
import { Link, Table } from "@kohaku/react"

/**
 * 常に下線のあるリンク。hover で色が濃くなる（freee Vibes と同じ）。
 * リンクの青と本文の差は 2.07:1 で、色だけでは文中のリンクを見分けられないため下線は外さない。
 */
const meta = {
  title: "Navigation/Link",
  component: Link,
  args: { href: "#", children: "経費精算の規程" },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** 状態。hover はマウスで、focus は Tab で確かめる */
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
      <Link href="#">通常</Link>
      <Link href="#" style={{ color: "var(--kh-color-link-hover)" }}>hover の色</Link>
    </div>
  ),
}

export const InText: Story = {
  render: () => (
    <p style={{ margin: 0, fontSize: "0.875rem", maxWidth: "28rem" }}>
      交通費は<Link href="#">経費精算の規程</Link>に沿って申請してください。
      領収書がない場合は<Link href="#">支払証明書</Link>を添付します。
    </p>
  ),
}

/** 表の行を開くボタンは asChild。子の要素に見た目だけ渡す（ルーターの Link も同じ） */
export const AsChild: Story = {
  render: () => (
    <Table>
      <thead><tr><th scope="col" data-fit>申請番号</th><th scope="col">名前</th><th scope="col" data-numeric>金額</th></tr></thead>
      <tbody>
        <tr>
          <td data-fit><Link asChild><button type="button">EX-1042</button></Link></td>
          <td>佐藤 美咲</td>
          <td data-numeric>¥12,800</td>
        </tr>
        <tr>
          <td data-fit><Link asChild><button type="button">EX-1041</button></Link></td>
          <td>田中 健太</td>
          <td data-numeric>¥3,240</td>
        </tr>
      </tbody>
    </Table>
  ),
}
