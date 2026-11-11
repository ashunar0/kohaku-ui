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

/**
 * `asChild` は、既に `<svg>` を出すコンポーネント（Lucide などのアイコンライブラリ）を
 * そのまま通すためのもの。kohaku は `data-kh="icon"` / `data-size` / `aria-hidden` を
 * 足すだけで、幾何（viewBox・stroke）には触らない。入れ子の svg は作らない。
 *
 * Lucide の既定は kohaku が期待する幾何と同じなので、そのまま収まる。
 *
 *     <Icon asChild><Search /></Icon>
 */
export const AsChild: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <Icon size="xl">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </Icon>
      <Icon size="xl" asChild>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </Icon>
      <span style={{ fontSize: ".75rem", color: "var(--kh-color-fg-faint)" }}>
        左: children にパス / 右: asChild
      </span>
    </div>
  ),
}
