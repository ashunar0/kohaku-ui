import type { Meta, StoryObj } from "@storybook/react-vite"
import { FileUpload } from "@kohaku/react"

const meta = {
  title: "Form/FileUpload",
  component: FileUpload,
  args: { label: "添付ファイル", maxFiles: 3, maxFileSize: 1024 * 1024 },
  decorators: [(Story) => <div style={{ maxWidth: "28rem" }}><Story /></div>],
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

/**
 * ドロップ領域・選んだファイルの一覧・却下されたファイルの一覧は `@kohaku/react` が組み立てる。
 *
 * - 領域はドロップを受けるだけ。選ぶ操作は中の「ファイルを選択」ボタン
 *   （Ark の既定は領域が role="button" になり、中のボタンと入れ子になるため）
 * - 却下されたファイルは理由と一緒に一覧に出す。黙って消えたように見せない
 * - 大きさは Windows と同じ 1024 区切り・KB / MB
 */
export const Default: Story = {}

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <FileUpload label="既定" maxFiles={3} />
      <FileUpload label="画像だけ（プレビューが出る）" accept="image/*" maxFiles={5} />
      <FileUpload label="invalid" invalid />
      <FileUpload label="無効" disabled />
    </div>
  ),
}
