import type { Meta, StoryObj } from "@storybook/react-vite"
import { Textarea } from "@kohaku/react"

/**
 * Field の外で使う複数行の入力欄。Field.Root の中では Ark の `<Field.Textarea>` を使う。
 * 枠・focus・invalid は Input と共通で、違うのは高さと上下の余白だけ。
 */
const meta = {
  title: "Form/Textarea",
  component: Textarea,
  args: { placeholder: "招待メッセージ（任意）" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  decorators: [(Story) => <div style={{ maxWidth: "24rem" }}><Story /></div>],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** 複数行なので中央揃えではない。Input のような光学補正は入れない */
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".75rem" }}>
      <Textarea placeholder="空" />
      <Textarea defaultValue={"来週からプロジェクトに参加してもらいます。\nよろしくお願いします。"} />
      <Textarea disabled defaultValue="この欄は編集できません。" />
      <Textarea aria-invalid defaultValue="500 文字を超えています。" />
    </div>
  ),
}

/** 高さは中身で決まるので、size が変えるのは文字の大きさと左右の余白だけ */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".75rem" }}>
      <Textarea size="sm" placeholder="sm" />
      <Textarea size="md" placeholder="md" />
      <Textarea size="lg" placeholder="lg" />
    </div>
  ),
}
