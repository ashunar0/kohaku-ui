import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field } from "@kohaku/react"

/**
 * Ark の Field。label と入力欄の紐付け、invalid / disabled の伝播を Ark がやる。
 * kohaku は `[data-scope="field"][data-part="..."]` に CSS を当てるだけ。
 */
const meta = {
  title: "Form/Field",
  component: Field.Root,
  argTypes: {
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  render: (args) => (
    <div style={{ maxWidth: "24rem" }}>
      <Field.Root {...args}>
        <Field.Label>サブドメイン{args.required ? <Field.RequiredIndicator /> : null}</Field.Label>
        <Field.Input defaultValue="my-workspace" />
        <Field.HelperText>半角英数字とハイフン。</Field.HelperText>
        <Field.ErrorText>使用できない文字が含まれています。</Field.ErrorText>
      </Field.Root>
    </div>
  ),
} satisfies Meta<typeof Field.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = { args: { required: true } }

/**
 * 枠線・エラー文言・必須マークがすべて `--kh-color-invalid` を見る。
 * danger（塗り用）とは別のトークン。テーマで反転する
 * （light #e7000b / dark #ff6055）。
 */
export const Invalid: Story = { args: { invalid: true, required: true } }

export const Disabled: Story = { args: { disabled: true } }

/** textarea も同じ part 名で当たる */
export const Textarea: Story = {
  render: () => (
    <div style={{ maxWidth: "24rem" }}>
      <Field.Root>
        <Field.Label>メモ</Field.Label>
        <Field.Textarea defaultValue={"複数行の入力。\n中央揃えではないので光学補正は入れない。"} />
        <Field.HelperText>Markdown が使えます。</Field.HelperText>
      </Field.Root>
    </div>
  ),
}
