import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, HStack, VStack } from "@kohaku/react"

/**
 * 縦に積む VStack と、横に並べる HStack（freee Vibes と同じ名前）。
 * 間隔は kohaku の間隔トークンの番号（gap={4} = 16px。Tailwind の gap-4 と同じ）。
 * header など意味のある要素には data-kh="hstack" を直接書けば同じ並べ方になる。
 */
const meta = {
  title: "Layout/Stack",
  component: VStack,
} satisfies Meta<typeof VStack>

export default meta
type Story = StoryObj<typeof meta>

const Box = ({ children }: { children: React.ReactNode }) => (
  <span style={{ padding: "0.5rem 0.75rem", border: "1px dashed var(--kh-color-border-strong)", borderRadius: "0.25rem", fontSize: "0.875rem" }}>
    {children}
  </span>
)

/** 既定。VStack は 16px で横幅いっぱい、HStack は 8px で縦は中央・折り返す */
export const States: Story = {
  render: () => (
    <VStack gap={6}>
      <VStack><Box>VStack</Box><Box>既定は 16px</Box></VStack>
      <HStack><Box>HStack</Box><Box>既定は 8px</Box><Box>縦は中央</Box></HStack>
    </VStack>
  ),
}

export const Gap: Story = {
  render: () => (
    <VStack gap={6}>
      {([0, 1, 2, 3, 4, 5, 6, 8] as const).map((g) => (
        <HStack key={g} gap={g}><Box>gap={g}</Box><Box>gap={g}</Box><Box>gap={g}</Box></HStack>
      ))}
    </VStack>
  ),
}

/** ページの見出しの行。両端に寄せ、下でそろえる */
export const PageHead: Story = {
  render: () => (
    <HStack justify="between" align="end" gap={4}>
      <VStack gap={1}>
        <strong style={{ fontSize: "1.5rem" }}>経費申請</strong>
        <span style={{ fontSize: "0.75rem", color: "var(--kh-color-fg-muted)" }}>部署の申請を確認して承認します。</span>
      </VStack>
      <HStack><Button variant="outline">CSV で書き出す</Button><Button>新しい申請</Button></HStack>
    </HStack>
  ),
}
