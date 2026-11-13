import type { Meta, StoryObj } from "@storybook/react-vite"
import { Select, createListCollection } from "@kohaku/react"

const plans = createListCollection({
  items: [
    { label: "Free — 個人で試す", value: "free" },
    { label: "Pro — チームで使う", value: "pro" },
    { label: "Enterprise — 監査ログつき", value: "ent" },
  ],
})

/**
 * Control / Portal / Positioner は `Select.Trigger` と `Select.Content` の
 * 内側に隠れている。素で組みたいときは `Select.Control` /
 * `Select.RawTrigger` / `Select.RawContent` を使う。
 *
 * トリガーの ▾ と選択済みの ✓ は CSS が描く（`--kh-glyph-chevron-down` /
 * `--kh-glyph-check`）。開くとシェブロンが 180° 回る。
 */
type Plan = { label: string; value: string }

const meta: Meta<typeof Select.Root<Plan>> = {
  title: "Form/Select",
  component: Select.Root,
  args: { collection: plans },
  decorators: [(Story) => <div style={{ maxWidth: "18rem" }}><Story /></div>],
}

export default meta
type Story = StoryObj<typeof meta>

const render = (extra: Record<string, unknown> = {}) => (
  <Select.Root collection={plans} defaultValue={["pro"]} {...extra}>
    <Select.Label>プラン</Select.Label>
    <Select.Trigger>
      <Select.ValueText placeholder="選択してください" />
      <Select.Indicator />
    </Select.Trigger>
    <Select.Content>
      {plans.items.map((item) => (
        <Select.Item key={item.value} item={item}>
          <Select.ItemText>{item.label}</Select.ItemText>
          <Select.ItemIndicator />
        </Select.Item>
      ))}
    </Select.Content>
  </Select.Root>
)

export const Default: Story = { render: () => render() }

export const Empty: Story = { render: () => render({ defaultValue: [] }) }

export const Disabled: Story = { render: () => render({ disabled: true }) }

/** 枠だけ点線（Input と同じ）。フォーカスはできるが開かない */
export const ReadOnly: Story = { render: () => render({ readOnly: true }) }

export const Invalid: Story = { render: () => render({ invalid: true }) }
