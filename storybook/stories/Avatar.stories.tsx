import type { Meta, StoryObj } from "@storybook/react-vite"
import { Avatar, HStack, VStack } from "@kohaku/react"

/**
 * 利用者のアイコン。Ark の Avatar。Image / Fallback の組み立ては隠れている。
 *
 * 画像が無い・読み込めないときは名前の 1 文字目を出す。地と文字は Badge の灰色と同じ組。
 * 大きさは 32px で、祖先から `--kh-avatar-size` で寄せられる（文字は大きさの 0.375 倍）。
 *
 * 名前の文字と並べて置くのがふつうなので、既定では読み上げない（aria-hidden）。
 * 単独で置くときは `aria-hidden={false}` にして `aria-label` で名前を付ける。
 */
const meta = {
  title: "Base/Avatar",
  component: Avatar,
  args: { name: "あさひ" },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const photo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23b4c8f0'/%3E%3Ccircle cx='16' cy='13' r='6' fill='%23285ac8'/%3E%3Crect x='6' y='22' width='20' height='12' rx='6' fill='%23285ac8'/%3E%3C/svg%3E"

/** 文字だけ（和文・欧文）/ 画像あり / 画像が読み込めない（1 文字目に戻る） */
export const States: Story = {
  render: () => (
    <HStack gap={4}>
      <Avatar name="あさひ" />
      <Avatar name="山田 太郎" />
      <Avatar name="Asahi" />
      <Avatar name="佐藤 めぐみ" src={photo} />
      <Avatar name="鈴木 一郎" src="/no-such-image.png" />
    </HStack>
  ),
}

/** 表やサイドバーでは名前と並べる。Avatar は読み上げないので、名前は文字で置く */
export const WithName: Story = {
  render: () => (
    <HStack gap={3} wrap={false}>
      <Avatar name="山田 太郎" />
      <VStack gap={0}>
        <strong style={{ fontSize: "var(--kh-text-md)" }}>山田 太郎</strong>
        <small style={{ fontSize: "var(--kh-text-sm)", color: "var(--kh-color-fg-muted)" }}>yamada@example.com</small>
      </VStack>
    </HStack>
  ),
}
