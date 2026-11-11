import type { Meta, StoryObj } from "@storybook/react-vite"

/**
 * 文字の大きさは 4 段だけ。**12 / 14 / 16 / 24**（freee Vibes と同じ形）。
 *
 * - 下は 2px 刻み、ページ見出しだけ 1.5 倍に跳ぶ
 * - 13px は持たない（14 と見分けがつかず、使い分けの基準が作れない）
 * - 見出しの階層は大きさだけでなく太さでも作る（h3 は本文と同じ 14px の太字）
 *
 * 操作する部品の文字は**高さで決まる**: 28px → 12 / 36・40px → 14 / 44px → 16。
 * 補助の文字（ヘルプ・エラー・Tooltip・Badge）は 12。
 */
const meta = {
  title: "Foundations/Typography",
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { token: "--kh-text-xl", px: 24, role: "ページ見出し・ダイアログのタイトル・大きな数字", weight: 700 },
  { token: "--kh-text-lg", px: 16, role: "セクション見出し（太字）・高さ 44px の部品", weight: 700 },
  { token: "--kh-text-md", px: 14, role: "既定。本文・ナビ・表・高さ 36〜40px の部品。小見出しは太字で", weight: 400 },
  { token: "--kh-text-sm", px: 12, role: "補助（ヘルプ・エラー・Tooltip・Badge・注記）・高さ 28px の部品", weight: 400 },
]

export const Scale: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      {rows.map((r) => (
        <div key={r.token} style={{ display: "grid", gridTemplateColumns: "9rem 1fr", gap: "1rem", alignItems: "baseline" }}>
          <code style={{ fontSize: "0.75rem", color: "var(--kh-color-fg-muted)" }}>
            {r.token}<br />{r.px}px
          </code>
          <div>
            <div style={{ fontSize: `var(${r.token})`, fontWeight: r.weight, lineHeight: "var(--kh-leading-tight)" }}>
              経費申請の承認 ¥42,800
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--kh-color-fg-muted)", marginTop: ".25rem" }}>{r.role}</div>
          </div>
        </div>
      ))}
    </div>
  ),
}

/** 実際の画面での組み合わせ。h1 = xl / h2 = lg 太字 / h3 = md 太字 / 本文 = md / 注記 = sm */
export const Hierarchy: Story = {
  render: () => (
    <div style={{ maxWidth: "36rem" }}>
      <h1 style={{ fontSize: "var(--kh-text-xl)", fontWeight: 700, margin: 0 }}>経費申請</h1>
      <h2 style={{ fontSize: "var(--kh-text-lg)", fontWeight: 700, margin: "1.5rem 0 0" }}>承認待ちの申請</h2>
      <h3 style={{ fontSize: "var(--kh-text-md)", fontWeight: 700, margin: "1rem 0 0" }}>営業部</h3>
      <p style={{ fontSize: "var(--kh-text-md)", margin: ".5rem 0 0" }}>
        大阪支社との打ち合わせ（往復）。領収書を 1 枚添付しています。
      </p>
      <p style={{ fontSize: "var(--kh-text-sm)", color: "var(--kh-color-fg-muted)", margin: ".25rem 0 0" }}>
        2026 年 11 月 10 日に申請
      </p>
    </div>
  ),
}
