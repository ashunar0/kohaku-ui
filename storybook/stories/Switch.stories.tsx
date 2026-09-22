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
 * checkbox と違い、切り替えた瞬間に効く設定に使う。
 * 送信して初めて反映されるものは checkbox。
 */
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".5rem" }}>
      <Switch>off</Switch>
      <Switch defaultChecked>on</Switch>
      <Switch disabled>無効</Switch>
      <Switch disabled defaultChecked>無効・on</Switch>
    </div>
  ),
}

/**
 * つまみは light / dark とも明るい面。off のトラックが薄いので light では
 * 影で分離する（`--kh-shadow-thumb`）。ツールバーでテーマを切り替えて確認できる。
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: ".75rem" }}>
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
