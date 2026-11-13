import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge, Button, Icon, IconButton, Menu, Table } from "@kohaku/react"

const meta = {
  title: "Overlay/Menu",
  component: Menu.Root,
} satisfies Meta<typeof Menu.Root>

export default meta
type Story = StoryObj<typeof meta>

/** 面と項目は Select のドロップダウンと同じ。Portal / Positioner は Menu.Content が隠している */
export const Default: Story = {
  render: () => (
    <Menu.Root positioning={{ placement: "bottom-start" }}>
      <Menu.Trigger asChild><Button variant="outline">操作</Button></Menu.Trigger>
      <Menu.Content>
        <Menu.Item value="view">内容を見る</Menu.Item>
        <Menu.Item value="copy">複製する</Menu.Item>
        <Menu.Separator />
        <Menu.Item value="archive">アーカイブ</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
}

/** 項目の状態。上から ハイライト（ホバー・矢印キー）/ 通常 / 無効 / 危険 */
export const States: Story = {
  render: () => (
    <div style={{ height: "14rem" }}>
      <Menu.Root defaultOpen defaultHighlightedValue="view" positioning={{ placement: "bottom-start" }}>
        <Menu.Trigger asChild><Button variant="outline">操作</Button></Menu.Trigger>
        <Menu.Content>
          <Menu.Item value="view">ハイライト</Menu.Item>
          <Menu.Item value="copy">通常</Menu.Item>
          <Menu.Separator />
          <Menu.Item value="archive" disabled>無効</Menu.Item>
          <Menu.Separator />
          <Menu.Item value="delete" variant="danger">危険（variant="danger"）</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  ),
}

/**
 * 削除など危険な操作は `variant="danger"` で文字だけ赤くする。当てたときの地はほかの項目と同じ。
 * 区切り線で離し、いちばん下に置く。押したあとに確認ダイアログか「取り消す」付きの通知を出す。
 */
export const Danger: Story = {
  render: () => (
    <div style={{ height: "12rem" }}>
      <Menu.Root defaultOpen positioning={{ placement: "bottom-start" }}>
        <Menu.Trigger asChild><Button variant="outline">操作</Button></Menu.Trigger>
        <Menu.Content>
          <Menu.Item value="edit">編集する</Menu.Item>
          <Menu.Item value="copy">複製する</Menu.Item>
          <Menu.Separator />
          <Menu.Item value="delete" variant="danger">削除する</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  ),
}

/** 表の行の操作。ボタンを並べず「…」1 つにまとめ、右端にそろえて開く */
export const InTable: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th scope="col" data-fit>申請番号</th>
          <th scope="col">科目</th>
          <th scope="col" data-fit>状態</th>
          <th scope="col" data-fit><span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>操作</span></th>
        </tr>
      </thead>
      <tbody>
        {[
          ["EX-1042", "交通費", "承認待ち", "warning", true],
          ["EX-1041", "会議費", "承認済み", "success", false],
        ].map(([id, cat, status, v, pending]) => (
          <tr key={id as string}>
            <td data-fit>{id as string}</td>
            <td>{cat as string}</td>
            <td data-fit><Badge variant={v as "warning"}>{status as string}</Badge></td>
            <td data-fit>
              <Menu.Root positioning={{ placement: "bottom-end" }}>
                <Menu.Trigger asChild>
                  <IconButton size="sm" variant="ghost" label={`${id} の操作`}>
                    <Icon><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></Icon>
                  </IconButton>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item value="view">内容を見る</Menu.Item>
                  {pending ? (
                    <>
                      <Menu.Separator />
                      <Menu.Item value="approve">承認する</Menu.Item>
                      <Menu.Item value="reject">差し戻す</Menu.Item>
                    </>
                  ) : null}
                </Menu.Content>
              </Menu.Root>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
}
