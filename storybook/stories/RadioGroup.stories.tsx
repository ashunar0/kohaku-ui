import type { Meta, StoryObj } from "@storybook/react-vite"
import { RadioGroup } from "@kohaku/react"

const plans = [
  ["free", "Free — 個人で試す"],
  ["pro", "Pro — チームで使う"],
  ["ent", "Enterprise — 監査ログつき"],
]

const meta = {
  title: "Form/RadioGroup",
  component: RadioGroup,
  args: { label: "プラン", defaultValue: "pro" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <RadioGroup {...args}>
      {plans.map(([v, l]) => (
        <RadioGroup.Item key={v} value={v}>{l}</RadioGroup.Item>
      ))}
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** 見出しは折り返しで 1 行目を占有する */
export const Horizontal: Story = {
  args: { orientation: "horizontal", label: "支払い周期", defaultValue: "month" },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Item value="month">毎月</RadioGroup.Item>
      <RadioGroup.Item value="year">毎年</RadioGroup.Item>
    </RadioGroup>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

/** 項目ごとに無効化する */
export const ItemDisabled: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Item value="free">Free</RadioGroup.Item>
      <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      <RadioGroup.Item value="ent" disabled>Enterprise（現在のプランでは選べません）</RadioGroup.Item>
    </RadioGroup>
  ),
}

/** label を省くとグループ見出しを出さない */
export const WithoutLabel: Story = { args: { label: undefined } }
