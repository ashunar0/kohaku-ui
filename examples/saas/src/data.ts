export type Status = "pending" | "approved" | "rejected" | "draft"

export type Expense = {
  id: string
  /** 申請日 */
  date: string
  applicant: string
  dept: string
  category: string
  /** 円 */
  amount: number
  status: Status
  note: string
  receipts: number
}

export const statusLabel: Record<Status, string> = {
  pending: "承認待ち",
  approved: "承認済み",
  rejected: "差し戻し",
  draft: "下書き",
}

const raw: Array<[string, string, string, string, number, Status, string, number]> = [
  ["2026-11-10", "山田 太郎", "営業部", "交通費", 1_240, "pending", "大阪支社との打ち合わせ（往復）", 1],
  ["2026-11-10", "佐藤 めぐみ", "開発部", "書籍", 3_740, "pending", "設計の参考書 2 冊", 2],
  ["2026-11-09", "鈴木 一郎", "営業部", "接待交際費", 42_800, "pending", "株式会社ワイズ様 会食 4 名", 1],
  ["2026-11-09", "田中 彩", "コーポレート", "備品", 8_980, "approved", "会議室用のホワイトボードマーカー一式", 1],
  ["2026-11-08", "高橋 健", "開発部", "ソフトウェア", 15_000, "approved", "デザインツールの年間ライセンス", 1],
  ["2026-11-08", "伊藤 さくら", "マーケティング", "広告費", 220_000, "pending", "11 月分のリスティング広告", 3],
  ["2026-11-07", "渡辺 涼", "開発部", "交通費", 680, "rejected", "領収書の宛名が個人名のため差し戻し", 1],
  ["2026-11-07", "中村 ひかり", "営業部", "宿泊費", 11_500, "approved", "福岡出張 1 泊", 2],
  ["2026-11-06", "小林 大輔", "コーポレート", "通信費", 4_320, "approved", "社用携帯の追加回線", 1],
  ["2026-11-06", "加藤 美咲", "開発部", "研修費", 55_000, "pending", "アクセシビリティ研修の受講料", 1],
  ["2026-11-05", "吉田 翔", "マーケティング", "外注費", 180_000, "approved", "イベント用バナーの制作", 4],
  ["2026-11-05", "山本 結衣", "営業部", "交通費", 2_060, "draft", "名古屋 往復（領収書待ち）", 0],
  ["2026-11-04", "松本 蓮", "開発部", "備品", 26_400, "approved", "モニターアーム 2 台", 2],
  ["2026-11-04", "井上 千尋", "コーポレート", "採用費", 96_000, "pending", "求人媒体の掲載延長", 1],
  ["2026-11-02", "木村 奏", "営業部", "接待交際費", 18_700, "rejected", "上限超過のため分割して再申請", 2],
]

export const expenses: Expense[] = raw.map(
  ([date, applicant, dept, category, amount, status, note, receipts], i) => ({
    id: `EX-2026-${String(1043 - i).padStart(4, "0")}`,
    date,
    applicant,
    dept,
    category,
    amount,
    status,
    note,
    receipts,
  }),
)

export const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`

export const formatDate = (iso: string) => {
  const [, m, d] = iso.split("-")
  return `${Number(m)}月${Number(d)}日`
}
