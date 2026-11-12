import type { Meta, StoryObj } from "@storybook/react-vite"
import { IconButton, Icon, Table, VisuallyHidden } from "@kohaku/react"

/**
 * 画面には出さず、読み上げにだけ出す（freee Vibes と同じ名前）。
 * Tailwind を使う画面なら Tailwind の sr-only でも同じ。
 */
const meta = {
  title: "Utility/VisuallyHidden",
  component: VisuallyHidden,
  args: { children: "読み上げにだけ出る文" },
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

/** 何も見えないのが正しい。読み上げでは「読み上げにだけ出る文」と読まれる */
export const Default: Story = {}

/** アイコンだけが並ぶ列の見出し。見出しを読み上げにだけ出す */
export const ColumnHeader: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th scope="col">名前</th>
          <th scope="col" data-fit><VisuallyHidden>操作</VisuallyHidden></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>佐藤 美咲</td>
          <td data-fit>
            <IconButton size="sm" variant="ghost" label="佐藤 美咲の操作">
              <Icon><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></Icon>
            </IconButton>
          </td>
        </tr>
      </tbody>
    </Table>
  ),
}
