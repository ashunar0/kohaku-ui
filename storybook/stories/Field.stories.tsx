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

/**
 * 必須の印は「必須」の小さなバッジ（10px）。Ark が入れる `*` を CSS で描き替えている。
 * 文言は `--kh-field-required-text` で変えられる。
 */
export const Required: Story = { args: { required: true } }

/**
 * 枠線とエラー文言が `--kh-color-invalid` を見る（必須のバッジは塗りなので danger の soft）。
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

/**
 * PC 前提の項目が多いフォーム用。祖先に `data-label-position="side"` を付けると
 * 中の Field がまとめて横並びになる。ラベル列の幅は `--kh-field-label-width`（既定 8rem）。
 * ラベルは左寄せで、入力欄の 1 行目と中心を揃える（textarea も）。
 */
export const LabelSide: Story = {
  render: () => (
    <form data-label-position="side" style={{ display: "grid", gap: "1rem", maxWidth: "32rem" }}>
      <Field.Root required>
        <Field.Label>氏名<Field.RequiredIndicator /></Field.Label>
        <Field.Input defaultValue="あさひ" />
      </Field.Root>
      <Field.Root required invalid>
        <Field.Label>メールアドレス<Field.RequiredIndicator /></Field.Label>
        <Field.Input defaultValue="asahi@" />
        <Field.ErrorText>メールアドレスの形式が正しくありません。</Field.ErrorText>
      </Field.Root>
      <Field.Root>
        <Field.Label>会社名</Field.Label>
        <Field.Input />
      </Field.Root>
      <Field.Root>
        <Field.Label>自己紹介</Field.Label>
        <Field.Textarea />
        <Field.HelperText>プロフィールに表示されます。</Field.HelperText>
      </Field.Root>
    </form>
  ),
}
