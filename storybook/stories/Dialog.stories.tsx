import type { Meta, StoryObj } from "@storybook/react-vite"
import { Actions, Button, Dialog, Field } from "@kohaku/react"

/**
 * Portal / Backdrop / Positioner は `Dialog.Content` の内側に隠れている。
 * 素の構造で組みたいときは `Dialog.Backdrop` / `Dialog.Positioner` /
 * `Dialog.RawContent` が再輸出してある。
 *
 * 中身は <body> 直下に飛ぶので、CSS は子孫セレクタではなく
 * `[data-scope="dialog"][data-part="..."]` で狙っている。
 *
 * 右上の × は `Dialog.Content` が置く（読み上げの名前は「閉じる」、`closeLabel` で変えられる）。
 * 見出しの 1 行目の中央にそろい、見出しは × の手前で折り返す。足もとには「決める操作」だけを置く。
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

/**
 * × を出さない。どちらかを必ず選ばせたいとき用。
 * Esc と外のクリックで閉じるのは × と別なので、Root の `closeOnEscape` / `closeOnInteractOutside` で止める
 */
export const WithoutCloseTrigger: Story = {
  render: () => (
    <Dialog.Root defaultOpen closeOnEscape={false} closeOnInteractOutside={false}>
      <Dialog.Trigger asChild><Button>開く</Button></Dialog.Trigger>
      <Dialog.Content withoutCloseTrigger>
        <Dialog.Title>利用規約が変わりました</Dialog.Title>
        <Dialog.Description>続けるには、新しい利用規約に同意してください。</Dialog.Description>
        <Actions>
          <Dialog.CloseTrigger asChild><Button>同意して続ける</Button></Dialog.CloseTrigger>
        </Actions>
      </Dialog.Content>
    </Dialog.Root>
  ),
}

/** 長い見出しは × の手前で折り返す */
export const LongTitle: Story = {
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger asChild><Button>開く</Button></Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>2026 年 10 月分の経費申請をまとめて差し戻しますか</Dialog.Title>
        <Dialog.Description>申請者 12 人に通知されます。</Dialog.Description>
        <Actions>
          <Dialog.CloseTrigger asChild><Button variant="outline">やめる</Button></Dialog.CloseTrigger>
          <Dialog.CloseTrigger asChild><Button>差し戻す</Button></Dialog.CloseTrigger>
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
