import type { Meta, StoryObj } from "@storybook/react-vite"
import { Alert, Button, Icon } from "@kohaku/react"

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  args: {
    variant: "info",
    title: "メンテナンスのお知らせ",
    children: "3 月 12 日 2:00〜4:00 の間、一部機能が利用できません。",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["neutral", "danger", "warning", "success", "info"],
    },
    tone: { control: "inline-radio", options: [undefined, "soft"] },
    icon: { control: false },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * アイコンは variant ごとに CSS が描く。`icon` を渡す必要はない。
 * 一般に UI ライブラリはここを同梱しないが、kohaku は利用者が
 * Lucide に揃える前提なので既定で出す（経緯は docs/notes.md）。
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".75rem" }}>
      <Alert variant="info" title="メンテナンスのお知らせ">3 月 12 日 2:00〜4:00 は一部機能が使えません。</Alert>
      <Alert variant="success" title="デプロイが完了しました">2 分 14 秒で 3 件の変更が反映されました。</Alert>
      <Alert variant="warning" title="容量が残りわずかです">80% を超えました。不要なファイルを削除してください。</Alert>
      <Alert variant="danger" title="支払いが確認できませんでした">3 日以内に更新されない場合、サービスが停止します。</Alert>
      <Alert variant="neutral" title="neutral は絵柄を持たない">中立なのでアイコンを出さない。</Alert>
    </div>
  ),
}

/** 地を塗る版。情報量は同じで主張だけ強い。1 画面に 1 枚まで */
export const Soft: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".75rem" }}>
      <Alert variant="danger" tone="soft" title="支払いが確認できませんでした">3 日以内に更新されない場合、サービスが停止します。</Alert>
      <Alert variant="warning" tone="soft" title="容量が残りわずかです">80% を超えました。</Alert>
    </div>
  ),
}

/** icon を渡すと :empty が外れて既定のグリフが引っ込む */
export const CustomIcon: Story = {
  args: {
    title: "icon を渡した場合はそちらが勝つ",
    children: undefined,
    icon: <Icon><path d="M12 2v20" /><path d="m19 9-7 7-7-7" /></Icon>,
  },
}

/** 細かく組みたいときは part を直接使う */
export const WithActions: Story = {
  render: () => (
    <Alert.Root variant="warning">
      <Alert.Title>請求先情報が未入力です</Alert.Title>
      <Alert.Description>次回の請求までに入力してください。</Alert.Description>
      <Alert.Actions>
        <Button variant="outline" size="sm">あとで</Button>
        <Button size="sm">入力する</Button>
      </Alert.Actions>
    </Alert.Root>
  ),
}
