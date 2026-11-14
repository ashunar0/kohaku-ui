import type { Meta, StoryObj } from "@storybook/react-vite"
import { Avatar, DescriptionList, HStack } from "@kohaku/react"

/**
 * 項目名と値の並び（申請の詳細など）。項目名を左の列にそろえ、1 項目 1 行で上から読む。
 * 名前は freee Vibes に合わせた。見た目だけの並びなので kohaku が持つ（Ark には無い）。
 *
 * - 項目名の列は 8rem（`--kh-description-list-term-width`）。区切りは線でなく余白
 * - 項目名は値の 1 行目とベースラインでそろう。値が何行に折り返しても 1 行目に付く
 * - アイコンと名前を横に並べた 1 行の値は `align="center"`（横に並べた箱の基準線はアイコンの中の文字で決まるため）
 */
const meta = {
  title: "Base/DescriptionList",
  component: DescriptionList,
} satisfies Meta<typeof DescriptionList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <DescriptionList style={{ maxWidth: "32rem" }}>
      <DescriptionList.Item term="申請者" align="center">
        <HStack gap={2} wrap={false}>
          <Avatar name="山田 太郎" />
          <span>山田 太郎</span>
        </HStack>
      </DescriptionList.Item>
      <DescriptionList.Item term="部署">営業部</DescriptionList.Item>
      <DescriptionList.Item term="申請日">2026/11/10</DescriptionList.Item>
      <DescriptionList.Item term="科目">交通費</DescriptionList.Item>
      <DescriptionList.Item term="金額"><span style={{ fontVariantNumeric: "tabular-nums" }}>¥1,240</span></DescriptionList.Item>
      <DescriptionList.Item term="摘要">
        大阪支社との打ち合わせ（往復）。新幹線の指定席と、新大阪駅から支社までのタクシー代を含む
      </DescriptionList.Item>
    </DescriptionList>
  ),
}
