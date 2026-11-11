import { Toaster, createToaster } from "@kohaku/react"
import { BarChart3, Receipt, Settings, Users } from "lucide-react"
import { khIcon } from "./icon"
import { ExpensesPage } from "./ExpensesPage"

export const toaster = createToaster({ placement: "bottom-end", gap: 12 })

/* アイコンは利用側の責任。kohaku は図形を持たないので Lucide をそのまま使い、
   サイズ規約だけ data-kh="icon" で受ける（./icon.ts） */
const nav = [
  { label: "経費申請", Icon: Receipt, current: true },
  { label: "メンバー", Icon: Users },
  { label: "レポート", Icon: BarChart3 },
  { label: "設定", Icon: Settings },
]

export function App() {
  return (
    <div className="app">
      {/* ── サイドナビ: kohaku に無いので利用側で組む ───────────── */}
      <aside className="app-side">
        <div className="app-brand">
          <Receipt {...khIcon} />
          <span>Keihi</span>
        </div>
        <nav aria-label="メインメニュー">
          <ul className="app-nav">
            {nav.map(({ label, Icon, current }) => (
              <li key={label}>
                <a href="#" aria-current={current ? "page" : undefined}>
                  <Icon {...khIcon} />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="app-me">
          <span className="app-avatar" aria-hidden="true">あ</span>
          <span>
            <strong>あさひ</strong>
            <small>経理担当</small>
          </span>
        </div>
      </aside>

      <main className="app-main">
        <ExpensesPage />
      </main>

      <Toaster toaster={toaster} />
    </div>
  )
}
