import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field, Select, createListCollection } from "@kohaku/react"

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

const render = (extra: Record<string, unknown> = {}, size?: "sm" | "md" | "lg") => (
  <Select.Root collection={plans} defaultValue={["pro"]} {...extra}>
    <Select.Label>プラン</Select.Label>
    <Select.Trigger size={size}>
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

/** Input の size と同じ高さ（sm 36 / md 40 / lg 44px）。大きさは Trigger に付ける。表の中は sm */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "16rem" }}>
      {render({}, "sm")}
      {render({}, "md")}
      {render({}, "lg")}
    </div>
  ),
}

export const Empty: Story = { render: () => render({ defaultValue: [] }) }

export const Disabled: Story = { render: () => render({ disabled: true }) }

/** 枠だけ点線（Input と同じ）。フォーカスはできるが開かない */
export const ReadOnly: Story = { render: () => render({ readOnly: true }) }

export const Invalid: Story = { render: () => render({ invalid: true }) }

/**
 * 必須の印とエラー文言は Field で包んで出す。Ark の Select は Field と連携し、
 * required / invalid とラベルの紐付けを Field から受け取る。
 * 任意の印はラベルに `data-optional`（Field と同じ）。
 */
export const InField: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <Field.Root required invalid>
        <Select.Root collection={plans}>
          <Select.Label>プラン<Field.RequiredIndicator /></Select.Label>
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
          <Select.HiddenSelect />
        </Select.Root>
        <Field.ErrorText>プランを選んでください。</Field.ErrorText>
      </Field.Root>
      <Select.Root collection={plans}>
        <Select.Label data-optional>前のプラン</Select.Label>
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
    </div>
  ),
}
