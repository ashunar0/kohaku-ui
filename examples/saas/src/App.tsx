import { Breadcrumbs, HStack, Icon, IconButton, Input, Toaster, createToaster } from "@kohaku/react"
import { BarChart3, CircleHelp, Receipt, Search, Settings, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { ExpensesPage } from "./ExpensesPage"
import { NewExpensePage } from "./NewExpensePage"
import { SettingsPage } from "./SettingsPage"
import { SignupPage } from "./SignupPage"

export const toaster = createToaster({ placement: "bottom-end", gap: 12 })

/* アイコンは利用側の責任。kohaku は図形を持たないので Lucide をそのまま使い、
   サイズ規約は <Icon asChild> で与える */
const nav = [
  { label: "経費申請", Glyph: Receipt, href: "#/" },
  { label: "メンバー", Glyph: Users, href: "#" },
  { label: "レポート", Glyph: BarChart3, href: "#" },
  { label: "設定", Glyph: Settings, href: "#/settings" },
]

/** #/signup はログイン前なのでサイドバーを出さない。#/settings はサイドバーの中で切り替える */
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
  const page = hash === "#/settings" ? "設定" : "経費申請"
  const isNew = hash === "#/new"
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
            {nav.map(({ label, Glyph, href }) => (
              <li key={label}>
                <a href={href} aria-current={label === page ? "page" : undefined}>
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
            {isNew ? (
              <>
                <Breadcrumbs.Item href="#/">{page}</Breadcrumbs.Item>
                <Breadcrumbs.Item current>新規申請</Breadcrumbs.Item>
              </>
            ) : (
              <Breadcrumbs.Item current>{page}</Breadcrumbs.Item>
            )}
          </Breadcrumbs>
          <HStack wrap={false}>
            <Input type="search" size="sm" icon={<Search />} placeholder="申請・メンバーを検索" aria-label="検索" className="app-search" />
            <IconButton variant="ghost" size="sm" label="ヘルプ">
              <Icon asChild><CircleHelp /></Icon>
            </IconButton>
          </HStack>
        </header>
        <div className="app-body">
          {page === "設定" ? <SettingsPage /> : isNew ? <NewExpensePage /> : <ExpensesPage />}
        </div>
      </main>

      <Toaster toaster={toaster} />
    </div>
  )
}
