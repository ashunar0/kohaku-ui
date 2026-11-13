import type { Meta, StoryObj } from "@storybook/react-vite"
import { Switch } from "@kohaku/react"

const meta = {
  title: "Form/Switch",
  component: Switch,
  args: { children: "ワークスペースを公開する" },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

export const Disabled: Story = {
  args: { disabled: true, children: "エンタープライズ機能（プラン外）" },
}

/**
 * ラベルと補足が左、スイッチは右端（iOS の設定と同じ）。縦に並べるとスイッチの列がそろう。
 * スイッチはラベルの 1 行目の中央に置く。補足は `aria-describedby` でつながり、
 * 読み上げではラベルとは別に読まれる（Ark の Switch はつながないので kohaku が足している）。
 */
export const Description: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", maxWidth: "28rem" }}>
      <Switch defaultChecked description="自分が承認する申請が出されたら知らせます。">申請が届いたとき</Switch>
      <Switch description="毎週月曜の朝に、先週の申請の件数と金額を送ります。">週のまとめ</Switch>
      <Switch>補足なし</Switch>
    </div>
  ),
}

/**
 * checkbox と違い、切り替えた瞬間に効く設定に使う。
 * 送信して初めて反映されるものは checkbox。
 */
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".75rem", maxWidth: "20rem" }}>
      <Switch>off</Switch>
      <Switch defaultChecked>on</Switch>
      <Switch disabled>無効</Switch>
      <Switch disabled defaultChecked>無効・on</Switch>
      <Switch invalid>invalid</Switch>
      <Switch description="補足文">補足つき</Switch>
      <Switch disabled description="補足文も薄くなる">無効・補足つき</Switch>
      <Switch aria-label="ラベルなし" />
    </div>
  ),
}

/**
 * つまみは light / dark とも明るい面。off のトラックが薄いので light では
 * 影で分離する（`--kh-shadow-thumb`）。ツールバーでテーマを切り替えて確認できる。
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".75rem", maxWidth: "20rem" }}>
      {[
        ["既定", {}],
        ["小", { "--kh-switch-width": "1.625rem", "--kh-switch-height": "1rem" }],
        ["大", { "--kh-switch-width": "2.25rem", "--kh-switch-height": "1.375rem" }],
      ].map(([label, style]) => (
        <div key={label as string} style={style as React.CSSProperties}>
          <Switch defaultChecked>{label as string}</Switch>
        </div>
      ))}
    </div>
  ),
}
