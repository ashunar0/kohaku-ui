import type { Meta, StoryObj } from "@storybook/react-vite"
import { Affix, Field, Group, Input } from "@kohaku/react"

/**
 * Field の外で使う素の入力欄。Field.Root の中では Ark の `<Field.Input>` を使う
 * （label との紐付けや invalid の伝播は Ark がやる）。
 */
const meta = {
  title: "Form/Input",
  component: Input,
  args: { placeholder: "you@example.com" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  decorators: [(Story) => <div style={{ maxWidth: "24rem" }}><Story /></div>],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** 36 / 40 / 44px。Button と同じ段 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".75rem" }}>
      <Input size="sm" placeholder="sm" />
      <Input size="md" placeholder="md" />
      <Input size="lg" placeholder="lg" />
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, defaultValue: "plan_free" } }

/**
 * focus リングは枠に重ねて描く。離して描くと隙間の分だけ「ずれている」ように
 * 見えるため、border 1px + inset 1px で同心の矩形にしている。
 */
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "my workspace" } }

const SearchGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
)

/** icon を渡すと枠の内側の左に置く。飾りなので読み上げには出さない（名前は aria-label で持たせる）。
 *  単位（円・歳）は枠の外。そちらは Affix */
export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: "20rem" }}>
      <Input type="search" size="sm" icon={SearchGlyph} placeholder="申請・メンバーを検索" aria-label="検索" />
      <Input type="search" icon={SearchGlyph} placeholder="申請・メンバーを検索" aria-label="検索" />
      <Input type="search" size="lg" icon={SearchGlyph} placeholder="申請・メンバーを検索" aria-label="検索" />
    </div>
  ),
}

/**
 * 数字だけが入る欄（金額・数量）は numeric。表の data-numeric と同じく右寄せ・等幅数字にし、
 * 縦位置を数字に合わせる（和文用の補正のままだと 1px 下に出る）。inputMode は numeric になる。
 * Field.Input には `data-numeric` を直接付ける
 */
export const Numeric: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Group>
        <Input numeric defaultValue="12,800" aria-label="金額" style={{ width: "10rem" }} />
        <Affix>円</Affix>
      </Group>
      <Field.Root>
        <Field.Label>数量</Field.Label>
        <Group>
          <Field.Input data-numeric="" inputMode="numeric" defaultValue="3" style={{ width: "5rem" }} />
          <Affix>個</Affix>
        </Group>
      </Field.Root>
    </div>
  ),
}

