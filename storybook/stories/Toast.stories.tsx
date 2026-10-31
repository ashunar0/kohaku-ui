import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, Toaster, createToaster } from "@kohaku/react"

const toaster = createToaster({ placement: "bottom-end", overlap: true })

const meta = {
  title: "Feedback/Toast",
  component: Toaster,
  args: { toaster },
  decorators: [(Story) => <div style={{ minHeight: "16rem" }}><Story /></div>],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

/**
 * `<Toaster>` をアプリの根元に 1 つ置き、`createToaster()` で作った toaster から出す。
 *
 * - 種類は `create`（info・既定）/ `success` / `warning` / `error` / `promise`（loading）
 * - info は Alert の neutral と同じくアイコンを持たない
 * - Ark の既定の名前は英語なので、`@kohaku/react` は「通知」「通知を閉じる」にしてある
 */
export const States: Story = {
  render: (args) => (
    <>
      <Toaster {...args} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
        <Button variant="outline" size="sm" onClick={() => toaster.create({ title: "下書きを保存しました" })}>info（既定）</Button>
        <Button variant="outline" size="sm" onClick={() => toaster.success({ title: "保存しました", description: "変更は全員に反映されます。" })}>success</Button>
        <Button variant="outline" size="sm" onClick={() => toaster.warning({ title: "まもなくセッションが切れます" })}>warning</Button>
        <Button variant="outline" size="sm" onClick={() => toaster.error({ title: "保存できませんでした", description: "通信が切れています。時間をおいてもう一度お試しください。" })}>error</Button>
        <Button variant="outline" size="sm" onClick={() => toaster.create({ title: "3 件を削除しました", action: { label: "元に戻す", onClick: () => {} } })}>action</Button>
        <Button variant="outline" size="sm" onClick={() => toaster.promise(new Promise((r) => setTimeout(r, 2000)), {
          loading: { title: "アップロード中…" }, success: { title: "アップロードしました" }, error: { title: "失敗しました" },
        })}>loading → success</Button>
      </div>
    </>
  ),
}
