import type { Meta, StoryObj } from "@storybook/react-vite"
import { Actions, Button, Dialog, Field } from "@kohaku/react"

/**
 * Portal / Backdrop / Positioner は `Dialog.Content` の内側に隠れている。
 * 素の構造で組みたいときは `Dialog.Backdrop` / `Dialog.Positioner` /
 * `Dialog.RawContent` が再輸出してある。
 *
 * 中身は <body> 直下に飛ぶので、CSS は子孫セレクタではなく
 * `[data-scope="dialog"][data-part="..."]` で狙っている。
 */
const meta = {
  title: "Overlay/Dialog",
  component: Dialog.Root,
} satisfies Meta<typeof Dialog.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild><Button>プロフィールを編集</Button></Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>プロフィールを編集</Dialog.Title>
        <Dialog.Description>変更内容はすぐに反映されます。</Dialog.Description>
        <Field.Root>
          <Field.Label>表示名</Field.Label>
          <Field.Input defaultValue="あさひ" />
        </Field.Root>
        <Actions>
          <Dialog.CloseTrigger asChild><Button variant="outline">キャンセル</Button></Dialog.CloseTrigger>
          <Dialog.CloseTrigger asChild><Button>保存する</Button></Dialog.CloseTrigger>
        </Actions>
      </Dialog.Content>
    </Dialog.Root>
  ),
}

/** 破壊的な操作の確認 */
export const Destructive: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild><Button variant="danger">ワークスペースを削除</Button></Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>ワークスペースを削除しますか？</Dialog.Title>
        <Dialog.Description>
          この操作は取り消せません。12 人のメンバーがアクセスできなくなります。
        </Dialog.Description>
        <Actions>
          <Dialog.CloseTrigger asChild><Button variant="outline">キャンセル</Button></Dialog.CloseTrigger>
          <Dialog.CloseTrigger asChild><Button variant="danger">削除する</Button></Dialog.CloseTrigger>
        </Actions>
      </Dialog.Content>
    </Dialog.Root>
  ),
}

/** backdrop を出さない。非モーダルな表示など */
export const WithoutBackdrop: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild><Button variant="outline">backdrop なしで開く</Button></Dialog.Trigger>
      <Dialog.Content withoutBackdrop>
        <Dialog.Title>backdrop なし</Dialog.Title>
        <Dialog.Description>地を暗くしない。背後が読めるままになる。</Dialog.Description>
        <Actions>
          <Dialog.CloseTrigger asChild><Button>閉じる</Button></Dialog.CloseTrigger>
        </Actions>
      </Dialog.Content>
    </Dialog.Root>
  ),
}
