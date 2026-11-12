import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, Group, Icon, IconButton, Input, Tooltip } from "@kohaku/react"

const Search = () => (
  <Icon><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>
)

/**
 * アイコンだけのボタン。CSS は Button と同じで `data-icon` が付くだけなので、
 * variant / size / state はそのまま効く。幅は `--kh-button-height` を見るので
 * 祖先でサイズを寄せても正方形のまま付いてくる。
 *
 * `label` は必須。アイコンしか無いので名前が無いと読み上げが「ボタン」になる。
 * 書くのは **操作の名前**で、絵柄の名前ではない（虫眼鏡なら「拡大」ではなく「探す」）。
 *
 * Button に入っている和文の光学補正（`--kh-icon-optical-shift`）は、隣に文字が
 * 無いと 0.5px 上にずれるだけなので `data-icon` では切ってある。
 */
const meta = {
  title: "Core/IconButton",
  component: IconButton,
  args: { label: "探す", children: <Search /> },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** 状態を並べたもの。dark でも見る */
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        {(["solid", "outline", "ghost", "danger"] as const).map((v) => (
          <IconButton key={v} variant={v} label={`${v} の操作`}><Search /></IconButton>
        ))}
        <span style={{ fontSize: ".75rem", color: "var(--kh-color-fg-faint)" }}>variant</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        {(["xs", "sm", "md", "lg"] as const).map((sz) => (
          <IconButton key={sz} variant="outline" size={sz} label={`${sz} の操作`}><Search /></IconButton>
        ))}
        <span style={{ fontSize: ".75rem", color: "var(--kh-color-fg-faint)" }}>size（28 / 36 / 40 / 44）</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <IconButton variant="outline" disabled label="無効な操作"><Search /></IconButton>
        <IconButton variant="outline" loading label="探す"><Search /></IconButton>
        <IconButton loading label="探す"><Search /></IconButton>
        <span style={{ fontSize: ".75rem", color: "var(--kh-color-fg-faint)" }}>disabled / loading</span>
      </div>
    </div>
  ),
}

/**
 * 円にしたいとき（ツールバーの ghost など）は L3 トークンで 1 行。
 * Tailwind 併用なら `rounded-full` でも勝つ（利用側は layer の外）。
 */
export const Round: Story = {
  render: () => (
    <div style={{ display: "flex", gap: ".5rem" }}>
      {(["solid", "outline", "ghost"] as const).map((v) => (
        <IconButton
          key={v}
          variant={v}
          label={`${v} の操作`}
          style={{ "--kh-button-radius": "var(--kh-radius-full)" } as never}
        >
          <Search />
        </IconButton>
      ))}
    </div>
  ),
}

/** 入力欄と連結する。Group の中でも潰れず正方形のまま */
export const InGroup: Story = {
  render: () => (
    <Group attached style={{ maxWidth: "20rem" }}>
      <Input placeholder="申請者・摘要で探す" aria-label="申請を探す" />
      <IconButton variant="outline" label="探す"><Search /></IconButton>
    </Group>
  ),
}

/**
 * 絵柄の意味が自明でないときは Tooltip を添える。
 * Primer は既定で出すが、kohaku は選択肢を奪わないので利用側が決める。
 */
export const WithTooltip: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <IconButton variant="ghost" label="内容を見る">
          <Icon><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Icon>
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content>内容を見る</Tooltip.Content>
    </Tooltip.Root>
  ),
}

/** 文字のボタンと並べたとき、角丸と高さが揃う */
export const WithTextButton: Story = {
  render: () => (
    <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
      <Button variant="outline">CSV で書き出す</Button>
      <IconButton variant="outline" label="探す"><Search /></IconButton>
    </div>
  ),
}
