import type { DatePickerRootProps } from "@ark-ui/vue"

/** Ark の既定は英語（"Choose …" "Switch to next month" など）なので日本語にする。@kohaku/react と同じ文言 */
const views = { day: "月", month: "年", year: " 10 年" } as const
export const translations: NonNullable<DatePickerRootProps["translations"]> = {
  dayCell: (s) =>
    s.unavailable ? `選べません。${s.valueText}`
    : s.firstInRange ? `開始日、${s.valueText}`
    : s.lastInRange ? `終了日、${s.valueText}`
    : s.selected ? `選択中、${s.valueText}`
    : s.today ? `今日、${s.valueText}`
    : s.valueText,
  trigger: (open) => (open ? "カレンダーを閉じる" : "カレンダーを開く"),
  viewTrigger: (_view, next) => (next === "month" ? "月を選ぶ" : next === "year" ? "年を選ぶ" : "日を選ぶ"),
  prevTrigger: (view) => `前の${views[view]}`,
  nextTrigger: (view) => `次の${views[view]}`,
  placeholder: () => ({ year: "yyyy", month: "mm", day: "dd" }),
  content: "カレンダー",
  monthSelect: "月を選ぶ",
  yearSelect: "年を選ぶ",
  clearTrigger: "日付を消す",
  presetTrigger: ([start = "", end = ""]) => `${start} から ${end} を選ぶ`,
  weekColumnHeader: "週",
  weekNumberCell: (n) => `第 ${n} 週`,
}
