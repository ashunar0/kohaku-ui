import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field, Fieldset, Group } from "@kohaku/react"

/**
 * 複数の Field を 1 つの問いとして束ねる（氏名の姓・名、住所など）。Ark の Fieldset。
 *
 * Field は入力欄 1 つにつき 1 つ。Ark は Field 内の入力欄に同じ id を振るので、
 * 1 つの Field に入力欄を 2 つ入れてはいけない。姓・名は Field を 2 つ作って束ね、
 * Group で横に並べる。行を分けたいときは Group を縦に重ねる。
 *
 * 中のラベル（郵便番号など）は legend より一段小さく薄くし、入力欄の上に置く。
 */
const meta = {
  title: "Form/Fieldset",
  component: Fieldset.Root,
} satisfies Meta<typeof Fieldset.Root>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 姓・名は見える小ラベルを付けず、placeholder で示すよくある形。
 * placeholder は入力すると消えるので、読み上げ用の名前は aria-label で別に持たせる。
 *
 * 問い全体が必須なので、バッジは legend に 1 つ（`data-required`）。
 * 読み上げ用には中の Field それぞれに required を付ける。
 * 住所のように項目ごとに必須かどうかが違うときは、中のラベルに付ける。
 * 任意の印は `data-optional`（legend にも付けられる）。
 */
const Name = ({ legend, last, first, required = true, invalid = false }: {
  legend: string; last: string; first: string; required?: boolean; invalid?: boolean
}) => (
  <Fieldset.Root invalid={invalid}>
    <Fieldset.Legend data-required={required || undefined}>{legend}</Fieldset.Legend>
    <Group>
      <Field.Root required={required}><Field.Input placeholder={last} aria-label={last} /></Field.Root>
      <Field.Root required={required} invalid={invalid}><Field.Input placeholder={first} aria-label={first} /></Field.Root>
    </Group>
    {invalid && <Fieldset.ErrorText>{first}を入力してください。</Fieldset.ErrorText>}
  </Fieldset.Root>
)

/** 郵便番号・都道府県・市区町村 / 町名・番地 / 建物名・部屋番号 の 3 行 */
const Address = () => (
  <Fieldset.Root>
    <Fieldset.Legend>住所</Fieldset.Legend>
    <Group>
      <Field.Root required style={{ flex: "0 0 7rem" }}>
        <Field.Label>郵便番号<Field.RequiredIndicator /></Field.Label>
        <Field.Input placeholder="123-4567" inputMode="numeric" autoComplete="postal-code" />
      </Field.Root>
      <Field.Root required style={{ flex: "0 0 9rem" }}>
        <Field.Label>都道府県<Field.RequiredIndicator /></Field.Label>
        <Field.Input autoComplete="address-level1" />
      </Field.Root>
      <Field.Root required>
        <Field.Label>市区町村<Field.RequiredIndicator /></Field.Label>
        <Field.Input autoComplete="address-level2" />
      </Field.Root>
    </Group>
    <Group>
      <Field.Root required>
        <Field.Label>町名・番地<Field.RequiredIndicator /></Field.Label>
        <Field.Input autoComplete="address-line1" />
      </Field.Root>
    </Group>
    <Group>
      <Field.Root>
        <Field.Label data-optional>建物名・部屋番号</Field.Label>
        <Field.Input autoComplete="address-line2" />
      </Field.Root>
    </Group>
  </Fieldset.Root>
)

const Form = () => (
  <>
    <Name legend="氏名" last="姓" first="名" />
    <Name legend="氏名（カタカナ）" last="セイ" first="メイ" required={false} />
    <Address />
  </>
)

export const Default: Story = {
  decorators: [(Story) => <div style={{ maxWidth: "32rem" }}><Story /></div>],
  render: () => <form style={{ display: "grid", gap: "1.5rem" }}><Form /></form>,
}

/**
 * disabled は中の入力欄まで効く（素の fieldset の disabled）。
 * invalid は中の Field に伝わらないので、赤くしたい Field に invalid を付ける。
 */
export const States: Story = {
  decorators: [(Story) => <div style={{ maxWidth: "32rem" }}><Story /></div>],
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <Name legend="通常" last="姓" first="名" />
      <Name legend="エラー" last="姓" first="名" invalid />
      <Fieldset.Root disabled>
        <Fieldset.Legend>無効</Fieldset.Legend>
        <Group>
          <Field.Root><Field.Input placeholder="姓" aria-label="姓" /></Field.Root>
          <Field.Root><Field.Input placeholder="名" aria-label="名" /></Field.Root>
        </Group>
        <Fieldset.HelperText>変更できません。</Fieldset.HelperText>
      </Fieldset.Root>
    </div>
  ),
}

/**
 * ラベルを横に置くフォームの中では、legend が左の列に立ち、中の Field は横にしない。
 * legend は 1 行目の入力欄と中心を揃える（中のラベルがあればその分下げる）。
 */
export const LabelSide: Story = {
  decorators: [(Story) => <div style={{ maxWidth: "40rem" }}><Story /></div>],
  render: () => (
    <form data-label-position="side" style={{ display: "grid", gap: "1.5rem" }}>
      <Form />
    </form>
  ),
}

/**
 * 箱が 26rem より狭いと legend を上に戻す（Field の LabelSideNarrow と同じ）。
 * 横に並べた Field は 8rem（`--kh-field-min-width`）を割ると次の行に落ちる。
 * 住所なら郵便番号・都道府県は残り、市区町村だけが落ちる。
 */
export const LabelSideNarrow: Story = {
  decorators: [(Story) => <div style={{ width: "22rem" }}><Story /></div>],
  render: () => (
    <form data-label-position="side" style={{ display: "grid", gap: "1.5rem" }}>
      <Form />
    </form>
  ),
}
