import type { Meta, StoryObj } from "@storybook/react-vite"
import { Pagination } from "@kohaku/react"

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  args: { count: 200, pageSize: 10, defaultPage: 1 },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 前後のボタン・ページ番号・省略は `@kohaku/react` が組み立てる。
 * Ark の既定ラベルは英語なので日本語にしてある。Ark を直接使うときは `translations` を渡す。
 *
 * 矢印は空のボタンに CSS が描く。`<svg>` を入れれば差し替わる。
 */
export const Default: Story = {}

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Pagination count={200} pageSize={10} defaultPage={1} />
      <Pagination count={200} pageSize={10} defaultPage={10} />
      <Pagination count={200} pageSize={10} defaultPage={20} />
      <Pagination count={200} pageSize={10} defaultPage={10} showEdges />
      <Pagination count={30} pageSize={10} defaultPage={2} />
    </div>
  ),
}

/** `type="link"` で各ボタンが `<a>` になる。端では href が外れ、押せなくなる */
export const Link: Story = {
  args: { count: 50, pageSize: 10, type: "link", getPageUrl: ({ page }) => `?page=${page}` },
}
