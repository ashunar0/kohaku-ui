import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input, Textarea } from "@kohaku/react"

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

export const TextareaStory: StoryObj<typeof Textarea> = {
  name: "Textarea",
  render: () => <Textarea placeholder="複数行の入力" />,
}
