import type { Meta, StoryObj } from "@storybook/react-vite"
import { Icon } from "@kohaku/react"

/**
 * kohaku はアイコンの絵柄を持たない。`<svg>` の外枠と寸法だけを与える。
 * 期待する幾何は Lucide と同じ viewBox 24 / stroke-width 2 / round。
 * この規約に従うセット（Lucide, Tabler など）ならそのまま差し込める。
 *
 * 例外は「部品を操作するために要る図形」で、checkbox のチェックや
 * select のシェブロンは CSS が `--kh-glyph-*` を mask で描く。
 */
const meta = {
  title: "Base/Icon",
  component: Icon,
  args: { children: <path d="M20 6 9 17l-5-5" /> },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] } },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {(["sm", "md", "lg", "xl"] as const).map((s) => (
        <Icon key={s} size={s}><path d="M20 6 9 17l-5-5" /></Icon>
      ))}
    </div>
  ),
}

/** color は継承する。親の文字色に揃う */
export const InheritsColor: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {["--kh-color-fg", "--kh-color-fg-muted", "--kh-color-danger", "--kh-color-success"].map((t) => (
        <span key={t} style={{ color: `var(${t})` }}>
          <Icon size="lg"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></Icon>
        </span>
      ))}
    </div>
  ),
}
