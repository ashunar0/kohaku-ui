import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field, PasswordInput } from "@kohaku/react"

/**
 * Ark の PasswordInput。右端のボタンで表示を切り替える。入力欄の見た目は Input と同じ。
 *
 * - 隠しているときは目、見せているときは斜線の入った目。位置と大きさは素の select の矢印と同じ
 * - ボタンは Tab で止まり、Enter / Space でも切り替わる（Ark の既定は Tab で止まらず、マウスだけ）
 * - 読み上げは「パスワードを表示」「パスワードを隠す」
 * - Field.Root の中に置くと invalid / required / disabled と入力欄の id を Field から受け取る
 */
const meta = {
  title: "Form/PasswordInput",
  component: PasswordInput,
  decorators: [(Story) => <div style={{ maxWidth: "20rem" }}><Story /></div>],
} satisfies Meta<typeof PasswordInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { label: "パスワード", autoComplete: "current-password" } }

/** 上から 隠している / 見せている / エラー / 無効 */
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <PasswordInput label="隠している" defaultValue="abcd1234" />
      <PasswordInput label="見せている" defaultValue="abcd1234" defaultVisible />
      <Field.Root invalid required>
        <Field.Label>エラー<Field.RequiredIndicator /></Field.Label>
        <PasswordInput defaultValue="abc" autoComplete="new-password" />
        <Field.HelperText>8 文字以上。英字と数字を混ぜると安全です。</Field.HelperText>
        <Field.ErrorText>8 文字以上で入力してください。</Field.ErrorText>
      </Field.Root>
      <Field.Root disabled>
        <Field.Label>無効</Field.Label>
        <PasswordInput defaultValue="abcd1234" />
      </Field.Root>
    </div>
  ),
}
