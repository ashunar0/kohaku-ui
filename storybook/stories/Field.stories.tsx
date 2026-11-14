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
 * 任意の印は必須と同じ形の灰色のバッジ。ラベルに `data-optional` を付ける（opt-in）。
 * 必須と任意のどちらに印を付けるかは画面が決める（少ない方だけに付けるなど）。
 * required の Field では付けても出ない（Ark のラベルが持つ `data-required` で消している）。
 * 文言は `--kh-field-optional-text` で変えられる。
 */
export const Optional: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: "24rem" }}>
      <Field.Root required>
        <Field.Label>会社名<Field.RequiredIndicator /></Field.Label>
        <Field.Input />
      </Field.Root>
      <Field.Root>
        <Field.Label data-optional>部署</Field.Label>
        <Field.Input />
      </Field.Root>
    </div>
  ),
}

/**
 * 枠線とエラー文言が `--kh-color-invalid` を見る（必須のバッジは塗りなので danger の soft）。
 * danger（塗り用）とは別のトークン。テーマで反転する
 * （light #e7000b / dark #ff6055）。
 */
export const Invalid: Story = { args: { invalid: true, required: true } }

export const Disabled: Story = { args: { disabled: true } }

/**
 * 読み取り専用は枠だけ点線（デジタル庁と同じ）。値は読めるので文字は濃いまま。
 * disabled と違ってフォーカスでき、読み上げられ、送信もされる。
 * 変えられない理由は補足文に書く。
 */
export const ReadOnly: Story = { args: { readOnly: true } }

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: "24rem" }}>
      {([
        ["ふつう", {}],
        ["エラー", { invalid: true }],
        ["読み取り専用", { readOnly: true }],
        ["無効", { disabled: true }],
      ] as const).map(([label, props]) => (
        <Field.Root key={label} {...props}>
          <Field.Label>{label}</Field.Label>
          <Field.Input defaultValue="my-workspace" />
          <Field.HelperText>半角英数字とハイフン。</Field.HelperText>
          <Field.ErrorText>使用できない文字が含まれています。</Field.ErrorText>
        </Field.Root>
      ))}
    </div>
  ),
}

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
 * 素の `<select>`（Field.Select）。都道府県のように項目が多く、スマホで OS の選択画面を使いたいとき用。
 * 見た目は Ark の Select の表示欄にそろえる（矢印・余白・文字の位置）。
 * 値が空の option を選んでいる間は placeholder と同じ薄さになる。
 */
export const NativeSelect: Story = {
  render: () => {
    const prefs = ["北海道", "東京都", "大阪府", "沖縄県"]
    const Row = ({ label, ...props }: { label: string } & Parameters<typeof Field.Root>[0]) => (
      <Field.Root {...props} style={{ maxWidth: "12rem" }}>
        <Field.Label>{label}</Field.Label>
        <Field.Select defaultValue={label === "選んだあと" ? "東京都" : ""}>
          <option value="">選んでください</option>
          {prefs.map((p) => <option key={p}>{p}</option>)}
        </Field.Select>
        <Field.ErrorText>都道府県を選んでください。</Field.ErrorText>
      </Field.Root>
    )
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <Row label="選ぶ前" />
        <Row label="選んだあと" />
        <Row label="エラー" invalid />
        <Row label="無効" disabled />
      </div>
    )
  },
}

/**
 * PC 前提の項目が多いフォーム用。祖先に `data-label-position="side"` を付けると
 * 中の Field がまとめて横並びになる。ラベル列の幅は `--kh-field-label-width`（既定 9rem）。
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

/**
 * 横並びは、置かれた箱が 26rem より狭いとラベルを上に戻す（画面の幅ではなく箱の幅で決める。
 * 広い画面でもダイアログやサイドパネルの中では狭くなるため）。
 * 26rem = ラベル列 9rem + 隙間 1rem + 入力欄が最低 16rem。左が 32rem、右が 22rem の箱。
 */
export const LabelSideNarrow: Story = {
  render: () => {
    const form = (
      <form data-label-position="side" style={{ display: "grid", gap: "1rem" }}>
        <Field.Root required invalid>
          <Field.Label>メールアドレス<Field.RequiredIndicator /></Field.Label>
          <Field.Input defaultValue="asahi@" />
          <Field.ErrorText>メールアドレスの形式が正しくありません。</Field.ErrorText>
        </Field.Root>
        <Field.Root>
          <Field.Label>自己紹介</Field.Label>
          <Field.Textarea />
          <Field.HelperText>プロフィールに表示されます。</Field.HelperText>
        </Field.Root>
      </form>
    )
    return (
      <div style={{ display: "flex", gap: "2rem", alignItems: "start" }}>
        <div style={{ width: "32rem" }}>{form}</div>
        <div style={{ width: "22rem" }}>{form}</div>
      </div>
    )
  },
}
