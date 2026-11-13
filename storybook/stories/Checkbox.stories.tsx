import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox, Icon } from "@kohaku/react"

const meta = {
  title: "Form/Checkbox",
  component: Checkbox,
  args: { children: "メールで通知を受け取る" },
  argTypes: {
    checked: { control: "select", options: [true, false, "indeterminate"] },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    readOnly: { control: "boolean" },
    indicator: { control: false },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

/** チェックとは別の絵柄。CSS が data-state で描き分ける */
export const Indeterminate: Story = {
  args: { checked: "indeterminate", children: "一部のメンバーだけ選択中" },
}

export const Disabled: Story = {
  args: { disabled: true, children: "この設定は変更できません" },
}

/** 枠線とエラー文言が同じ --kh-color-invalid を見る */
export const Invalid: Story = {
  args: { invalid: true, children: "利用規約に同意する" },
}

/** ラベルなし。チェックボックスだけ置く */
export const WithoutLabel: Story = { args: { children: undefined } }

/**
 * 既定のチェックマークは CSS が `--kh-glyph-check` を mask で描く。
 * `indicator` に svg を渡すと `:empty` が外れて差し替わる。
 */
export const CustomIndicator: Story = {
  args: {
    defaultChecked: true,
    children: "indicator を渡して差し替える",
    indicator: <Icon><path d="M12 2v20" /><path d="m19 9-7 7-7-7" /></Icon>,
  },
}

/** 状態を一覧で見る */
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".5rem" }}>
      <Checkbox>未チェック</Checkbox>
      <Checkbox defaultChecked>チェック済み</Checkbox>
      <Checkbox checked="indeterminate">indeterminate</Checkbox>
      <Checkbox disabled>無効</Checkbox>
      <Checkbox disabled defaultChecked>無効・チェック済み</Checkbox>
      <Checkbox invalid>invalid</Checkbox>
      <Checkbox description="補足文">補足つき</Checkbox>
      <Checkbox disabled description="補足文も薄くなる">無効・補足つき</Checkbox>
      <Checkbox aria-label="ラベルなし" />
    </div>
  ),
}

/**
 * 補足はラベルの下、ラベルの左端にそろえる。箱はラベルの 1 行目の中央に置く。
 * 補足は `aria-describedby` でつながり、読み上げではラベルとは別に読まれる（Switch と同じ）。
 */
export const Description: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
      <Checkbox defaultChecked description="ログインと、お知らせの送り先に使います。">メールで通知を受け取る</Checkbox>
      <Checkbox description="毎週月曜の朝に、先週の申請の件数と金額を送ります。ラベルが長くて折り返しても、箱は 1 行目の中央に置きます。">
        週次のダイジェストを送る（ラベルが長いときの折り返しも確かめる）
      </Checkbox>
    </div>
  ),
}
