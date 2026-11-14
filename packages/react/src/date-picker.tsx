import { DatePicker as Ark, Portal, useFieldContext } from "@ark-ui/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

type RootProps = ComponentPropsWithoutRef<typeof Ark.Root>

export type DatePickerProps = RootProps & {
  /**
   * 入力欄の上に出す見出し。無いときは aria-label などで名前を付ける。
   * Field で包んだときは `<Field.RequiredIndicator />` を中に置ける
   */
  label?: ReactNode
  /** 範囲のときの入力欄の名前（読み上げ用）。既定は「開始日」「終了日」 */
  inputLabels?: [string, string]
}

/** Ark の既定は英語（"Choose …" "Switch to next month" など）なので日本語にする */
const views = { day: "月", month: "年", year: " 10 年" } as const
const translations: NonNullable<RootProps["translations"]> = {
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

/**
 * 入力欄・カレンダーの組み立てを隠す。日本語・日曜始まりが既定。
 * selectionMode="range" なら 1 つの枠に入力欄を 2 つ並べて「〜」でつなぐ。
 * 組み立てを自分で持ちたいときは DatePicker.Root などの素の部品を使う。
 */
export function DatePicker({ label, inputLabels = ["開始日", "終了日"], translations: t, positioning, children, ...props }: DatePickerProps) {
  const range = props.selectionMode === "range"
  // Ark の DatePicker は Field と連携しない（Select などはする）。Field で包まれたら
  // Select と同じものを Field から受け取る: 状態・ラベルの紐付け・補足文とエラー文言の紐付け
  const field = useFieldContext()
  const required = props.required ?? field?.required
  const described = field && {
    "aria-describedby": field.ariaDescribedby,
    "aria-errormessage": field.invalid ? field.getInputProps()["aria-errormessage"] : undefined,
  }
  return (
    <Ark.Root
      ids={field ? { label: () => field.ids.label, input: (i) => (i === 0 ? field.ids.control : `${field.ids.control}::${i}`), ...props.ids } : props.ids}
      disabled={field?.disabled}
      readOnly={field?.readOnly}
      invalid={field?.invalid}
      required={required}
      locale="ja-JP"
      translations={{ ...translations, ...t }}
      // カレンダーは入力欄より広いので、中央でなく左端にそろえる
      positioning={{ placement: "bottom-start", ...positioning }}
      {...props}
    >
      {/* data-required は任意の印を消すため（Field のラベルと同じ。field.css） */}
      {label ? <Ark.Label data-required={required ? "" : undefined}>{label}</Ark.Label> : null}
      <Ark.Control>
        <Ark.Input index={0} aria-label={range ? inputLabels[0] : undefined} {...described} />
        {range ? (
          <>
            <span data-kh="date-range-sep" aria-hidden="true">〜</span>
            <Ark.Input index={1} aria-label={inputLabels[1]} {...described} />
          </>
        ) : null}
        <Ark.Trigger />
      </Ark.Control>
      <Portal>
        <Ark.Positioner>
          <Ark.Content>
            <Calendar />
          </Ark.Content>
        </Ark.Positioner>
      </Portal>
      {children}
    </Ark.Root>
  )
}

/** 日・月・年の 3 つの表。ViewTrigger（「2026年11月」）で上の段に切り替わる */
function Calendar() {
  return (
    <>
      <Ark.View view="day">
        <Ark.Context>
          {(api) => (
            <>
              <Header />
              <Ark.Table>
                <Ark.TableHead>
                  <Ark.TableRow>
                    {api.weekDays.map((d, i) => <Ark.TableHeader key={i}>{d.narrow}</Ark.TableHeader>)}
                  </Ark.TableRow>
                </Ark.TableHead>
                <Ark.TableBody>
                  {api.weeks.map((week, i) => (
                    <Ark.TableRow key={i}>
                      {week.map((day, j) => (
                        <Ark.TableCell key={j} value={day}>
                          <Ark.TableCellTrigger>{day.day}</Ark.TableCellTrigger>
                        </Ark.TableCell>
                      ))}
                    </Ark.TableRow>
                  ))}
                </Ark.TableBody>
              </Ark.Table>
            </>
          )}
        </Ark.Context>
      </Ark.View>
      <Ark.View view="month">
        <Ark.Context>
          {(api) => (
            <>
              <Header />
              <Ark.Table>
                <Ark.TableBody>
                  {api.getMonthsGrid({ columns: 4, format: "short" }).map((months, i) => (
                    <Ark.TableRow key={i}>
                      {months.map((m, j) => (
                        <Ark.TableCell key={j} value={m.value}>
                          <Ark.TableCellTrigger>{m.label}</Ark.TableCellTrigger>
                        </Ark.TableCell>
                      ))}
                    </Ark.TableRow>
                  ))}
                </Ark.TableBody>
              </Ark.Table>
            </>
          )}
        </Ark.Context>
      </Ark.View>
      <Ark.View view="year">
        <Ark.Context>
          {(api) => (
            <>
              <Header />
              <Ark.Table>
                <Ark.TableBody>
                  {api.getYearsGrid({ columns: 4 }).map((years, i) => (
                    <Ark.TableRow key={i}>
                      {years.map((y, j) => (
                        <Ark.TableCell key={j} value={y.value}>
                          <Ark.TableCellTrigger>{y.label}</Ark.TableCellTrigger>
                        </Ark.TableCell>
                      ))}
                    </Ark.TableRow>
                  ))}
                </Ark.TableBody>
              </Ark.Table>
            </>
          )}
        </Ark.Context>
      </Ark.View>
    </>
  )
}

function Header() {
  return (
    <Ark.ViewControl>
      <Ark.PrevTrigger />
      <Ark.ViewTrigger><Ark.RangeText /></Ark.ViewTrigger>
      <Ark.NextTrigger />
    </Ark.ViewControl>
  )
}

/** 素の構造で組みたいとき用。Calendar は Content の中身（日・月・年の表）だけ */
DatePicker.Root = Ark.Root
DatePicker.Label = Ark.Label
DatePicker.Control = Ark.Control
DatePicker.Input = Ark.Input
DatePicker.Trigger = Ark.Trigger
DatePicker.ClearTrigger = Ark.ClearTrigger
DatePicker.Positioner = Ark.Positioner
DatePicker.Content = Ark.Content
DatePicker.Context = Ark.Context
DatePicker.Calendar = Calendar
DatePicker.translations = translations
