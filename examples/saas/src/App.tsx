import { Breadcrumbs, HStack, Icon, IconButton, Input, Toaster, createToaster } from "@kohaku/react"
import { BarChart3, CircleHelp, Receipt, Search, Settings, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { ExpensesPage } from "./ExpensesPage"
import { SignupPage } from "./SignupPage"

export const toaster = createToaster({ placement: "bottom-end", gap: 12 })

/* アイコンは利用側の責任。kohaku は図形を持たないので Lucide をそのまま使い、
   サイズ規約は <Icon asChild> で与える */
const nav = [
  { label: "経費申請", Glyph: Receipt, current: true },
  { label: "メンバー", Glyph: Users },
  { label: "レポート", Glyph: BarChart3 },
  { label: "設定", Glyph: Settings },
]

/** #/signup だけ別の画面（ログイン前なのでサイドバーを出さない） */
function useHash() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const on = () => setHash(location.hash)
    addEventListener("hashchange", on)
    return () => removeEventListener("hashchange", on)
  }, [])
  return hash
}

export function App() {
  const hash = useHash()
  if (hash === "#/signup") {
    return (
      <>
        <SignupPage />
        <Toaster toaster={toaster} />
      </>
    )
  }
  return (
    <div className="app">
      {/* ── サイドナビ: kohaku に無いので利用側で組む ───────────── */}
      <aside className="app-side">
        <div className="app-brand">
          <Icon asChild><Receipt /></Icon>
          <span>Keihi</span>
        </div>
        <nav aria-label="メインメニュー">
          <ul className="app-nav">
            {nav.map(({ label, Glyph, current }) => (
              <li key={label}>
                <a href="#" aria-current={current ? "page" : undefined}>
                  <Icon asChild><Glyph /></Icon>
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
        {/* ── ヘッダー: 左にパンくず、右に全体の検索とヘルプ ─────── */}
        <header className="app-head" data-kh="hstack" data-justify="between" data-gap="4" data-nowrap="">
          <Breadcrumbs>
            <Breadcrumbs.Item href="#">ホーム</Breadcrumbs.Item>
            <Breadcrumbs.Item current>経費申請</Breadcrumbs.Item>
          </Breadcrumbs>
          <HStack wrap={false}>
            <Input type="search" size="sm" icon={<Search />} placeholder="申請・メンバーを検索" aria-label="検索" className="app-search" />
            <IconButton variant="ghost" size="sm" label="ヘルプ">
              <Icon asChild><CircleHelp /></Icon>
            </IconButton>
          </HStack>
        </header>
        <div className="app-body">
          <ExpensesPage />
        </div>
      </main>

      <Toaster toaster={toaster} />
    </div>
  )
}
