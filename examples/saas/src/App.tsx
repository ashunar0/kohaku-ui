import { Badge, Icon, Toaster, createToaster } from "@kohaku/react"
import { ExpensesPage } from "./ExpensesPage"

export const toaster = createToaster({ placement: "bottom-end", gap: 12 })

/* アイコンは Lucide の幾何（viewBox 24 / stroke-width 2 / round）。
   kohaku は図形を持たないので、利用側がパスを書く。 */
const icons = {
  receipt: <path d="M4 2v20l3-2 3 2 3-2 3 2V2zM8 7h8M8 11h8M8 15h4" />,
  users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8M22 21v-2a4 4 0 0 0-3-3.87" />,
  chart: <path d="M3 3v16a2 2 0 0 0 2 2h16M7 16V9M12 16V5M17 16v-4" />,
  gear: <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.8 1.17V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 7.9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3 13.6H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 3.6V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 2.8 1.17l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.4 9H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />,
}

const nav = [
  { label: "経費申請", icon: icons.receipt, badge: "5", current: true },
  { label: "メンバー", icon: icons.users },
  { label: "レポート", icon: icons.chart },
  { label: "設定", icon: icons.gear },
]

export function App() {
  return (
    <div className="app">
      {/* ── サイドナビ: kohaku に無いので利用側で組む ───────────── */}
      <aside className="app-side">
        <div className="app-brand">
          <Icon size="md">{icons.receipt}</Icon>
          <span>Keihi</span>
        </div>
        <nav aria-label="メインメニュー">
          <ul className="app-nav">
            {nav.map((item) => (
              <li key={item.label}>
                <a href="#" aria-current={item.current ? "page" : undefined}>
                  <Icon size="sm">{item.icon}</Icon>
                  <span>{item.label}</span>
                  {item.badge ? <Badge variant="neutral">{item.badge}</Badge> : null}
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
