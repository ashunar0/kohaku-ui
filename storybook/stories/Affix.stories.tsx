import type { Meta, StoryObj } from "@storybook/react-vite"
import { Affix, Field, Fieldset, Group } from "@kohaku/react"

/**
 * 入力欄の外に添える単位や文字（歳・年・月・日・円）。Group の中で入力欄の隣に置く。
 *
 * 読み上げには出さない（aria-hidden）。入力欄の意味はラベルか aria-label で持たせる。
 * 数値は `type="number"` を使わず、`inputMode="numeric"` で数字キーボードを出す。
 */
const meta = {
  title: "Form/Affix",
  component: Affix,
  decorators: [(Story) => <div style={{ maxWidth: "24rem" }}><Story /></div>],
} satisfies Meta<typeof Affix>

export default meta
type Story = StoryObj<typeof meta>

/** 年齢。＋－で増減する値ではないので NumberInput は使わない */
export const Default: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>年齢</Field.Label>
      <Group>
        <Field.Input inputMode="numeric" style={{ width: "5rem" }} />
        <Affix>歳</Affix>
      </Group>
    </Field.Root>
  ),
}

/**
 * 生年月日は年・月・日の 3 欄。カレンダーやセレクトは使わない。
 * 欄の幅は桁数に合わせ、年を広くする。欄の間でフォーカスを自動で移さない。
 */
export const Birthdate: Story = {
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend data-required>生年月日</Fieldset.Legend>
      <Group>
        <Field.Root required style={{ flex: "0 0 4.5rem" }}>
          <Field.Input inputMode="numeric" autoComplete="bday-year" aria-label="年" />
        </Field.Root>
        <Affix>年</Affix>
        <Field.Root required style={{ flex: "0 0 3.5rem" }}>
          <Field.Input inputMode="numeric" autoComplete="bday-month" aria-label="月" />
        </Field.Root>
        <Affix>月</Affix>
        <Field.Root required style={{ flex: "0 0 3.5rem" }}>
          <Field.Input inputMode="numeric" autoComplete="bday-day" aria-label="日" />
        </Field.Root>
        <Affix>日</Affix>
      </Group>
      <Fieldset.HelperText>西暦で入力してください。</Fieldset.HelperText>
    </Fieldset.Root>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <Field.Root>
        <Field.Label>通常</Field.Label>
        <Group><Field.Input inputMode="numeric" defaultValue="34" style={{ width: "5rem" }} /><Affix>歳</Affix></Group>
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>エラー</Field.Label>
        <Group><Field.Input inputMode="numeric" defaultValue="340" style={{ width: "5rem" }} /><Affix>歳</Affix></Group>
        <Field.ErrorText>0〜150 の数字で入力してください。</Field.ErrorText>
      </Field.Root>
      <Field.Root disabled>
        <Field.Label>無効</Field.Label>
        <Group><Field.Input inputMode="numeric" defaultValue="34" style={{ width: "5rem" }} /><Affix>歳</Affix></Group>
      </Field.Root>
    </div>
  ),
}

/** 文字の大きさは Group の size に従う */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".75rem" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Group key={size} size={size}>
          <Field.Root style={{ flex: "0 0 7rem" }}><Field.Input inputMode="numeric" defaultValue="12000" aria-label={size} /></Field.Root>
          <Affix>円</Affix>
        </Group>
      ))}
    </div>
  ),
}
