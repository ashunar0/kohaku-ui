import { useMemo, useRef, useState, type FormEvent } from "react"
import {
  Actions,
  Badge,
  Button,
  Dialog,
  Field,
  HStack,
  Icon,
  IconButton,
  Input,
  Menu,
  RadioGroup,
  Select,
  Table,
  VisuallyHidden,
  VStack,
  createListCollection,
} from "@kohaku/react"
import { Ellipsis, Search } from "lucide-react"
import { toaster } from "./App"

/* メンバー一覧（#/members）。表・利用者のアイコン・招待のダイアログで kohaku の穴を探すための画面 */

type Role = "admin" | "approver" | "member"
type State = "active" | "invited" | "suspended"

const roleLabel: Record<Role, string> = { admin: "管理者", approver: "承認者", member: "一般" }
const stateLabel: Record<State, string> = { active: "有効", invited: "招待中", suspended: "利用停止" }
const stateVariant = { active: "success", invited: "info", suspended: undefined } as const

type Member = { id: string; name: string; email: string; dept: string; role: Role; state: State; lastLogin: string | null }

const members: Member[] = [
  ["あさひ", "asahi@example.com", "経理部", "admin", "active", "2026-11-14"],
  ["山田 太郎", "yamada@example.com", "営業部", "approver", "active", "2026-11-13"],
  ["佐藤 めぐみ", "sato@example.com", "開発部", "member", "active", "2026-11-14"],
  ["鈴木 一郎", "suzuki@example.com", "営業部", "member", "active", "2026-11-10"],
  ["田中 彩", "tanaka@example.com", "コーポレート", "approver", "active", "2026-11-12"],
  ["高橋 健", "takahashi@example.com", "開発部", "approver", "active", "2026-11-14"],
  ["伊藤 さくら", "ito@example.com", "マーケティング", "member", "active", "2026-11-08"],
  ["渡辺 涼", "watanabe@example.com", "開発部", "member", "suspended", "2026-09-30"],
  ["中村 ひかり", "nakamura@example.com", "営業部", "member", "active", "2026-11-11"],
  ["小林 大輔", "kobayashi@example.com", "コーポレート", "member", "invited", null],
].map(([name, email, dept, role, state, lastLogin], i) => ({
  id: `m${i + 1}`, name: name!, email: email!, dept: dept!, role: role as Role, state: state as State, lastLogin,
}))

const roleFilter = createListCollection({
  items: [{ label: "すべての権限", value: "all" }, ...Object.entries(roleLabel).map(([value, label]) => ({ label, value }))],
})
const depts = createListCollection({
  items: ["経理部", "営業部", "開発部", "マーケティング", "コーポレート"].map((d) => ({ label: d, value: d })),
})

const formatDate = (d: string | null) => {
  if (!d) return "—"
  const [, m, day] = d.split("-")
  return `${Number(m)}月${Number(day)}日`
}

export function MembersPage() {
  const [q, setQ] = useState("")
  const [role, setRole] = useState(["all"])
  const [inviting, setInviting] = useState(false)

  const rows = useMemo(
    () => members.filter((m) =>
      (role[0] === "all" || m.role === role[0]) &&
      (!q || `${m.name} ${m.email} ${m.dept}`.includes(q))),
    [q, role],
  )

  return (
    <VStack gap={4} className="page">
      <header className="page-head" data-kh="hstack" data-justify="between" data-gap="4">
        <h1>メンバー</h1>
        <Button onClick={() => setInviting(true)}>メンバーを招待</Button>
      </header>

      <VStack gap={3}>
        <HStack gap={3} className="filters">
          <Input
            icon={<Search />}
            type="search"
            placeholder="氏名・メールアドレス・部署で検索"
            aria-label="メンバーを検索"
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
          />
          <Select.Root collection={roleFilter} value={role} onValueChange={(d) => setRole(d.value)} className="filter-role">
            <Select.Trigger aria-label="権限">
              <Select.ValueText />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Content>
              {roleFilter.items.map((r) => (
                <Select.Item key={r.value} item={r}>
                  <Select.ItemText>{r.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </HStack>

        <Table>
          <thead>
            <tr>
              <th scope="col">氏名</th>
              <th scope="col">部署</th>
              <th scope="col" data-fit>権限</th>
              <th scope="col" data-fit>状態</th>
              <th scope="col" data-fit>最終ログイン</th>
              <th scope="col" data-fit><VisuallyHidden>操作</VisuallyHidden></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id}>
                <td>
                  <HStack gap={3} wrap={false}>
                    <span className="app-avatar" aria-hidden="true">{m.name[0]}</span>
                    <VStack gap={0} className="who">
                      <strong>{m.name}</strong>
                      <small>{m.email}</small>
                    </VStack>
                  </HStack>
                </td>
                <td>{m.dept}</td>
                <td data-fit>{roleLabel[m.role]}</td>
                <td data-fit><Badge variant={stateVariant[m.state]}>{stateLabel[m.state]}</Badge></td>
                <td data-fit>{formatDate(m.lastLogin)}</td>
                <td data-fit>
                  <Menu.Root
                    positioning={{ placement: "bottom-end" }}
                    onSelect={(d) => {
                      if (d.value === "resend") toaster.create({ title: "招待メールを再送信しました", description: m.email })
                      if (d.value === "suspend") toaster.create({ title: "利用を停止しました", description: m.name })
                      if (d.value === "resume") toaster.create({ title: "利用を再開しました", description: m.name })
                    }}
                  >
                    <Menu.Trigger asChild>
                      <IconButton size="sm" variant="ghost" label={`${m.name} の操作`}>
                        <Icon asChild><Ellipsis /></Icon>
                      </IconButton>
                    </Menu.Trigger>
                    <Menu.Content>
                      <Menu.Item value="edit">編集</Menu.Item>
                      {m.state === "invited" ? <Menu.Item value="resend">招待メールを再送信</Menu.Item> : null}
                      {m.state === "suspended" ? <Menu.Item value="resume">利用を再開</Menu.Item> : null}
                      {m.state === "active" && m.role !== "admin" ? (
                        <>
                          <Menu.Separator />
                          <Menu.Item value="suspend" variant="danger">利用を停止</Menu.Item>
                        </>
                      ) : null}
                    </Menu.Content>
                  </Menu.Root>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr data-empty="">
                <td colSpan={6}>該当するメンバーはいません。</td>
              </tr>
            ) : null}
          </tbody>
        </Table>

        <p className="count">{rows.length} 名</p>
      </VStack>

      <Invite open={inviting} onOpenChange={setInviting} />
    </VStack>
  )
}

/* ── 招待 ─────────────────────────────────────── */
function Invite({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState("")
  const [dept, setDept] = useState<string[]>([])
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const close = () => { onOpenChange(false); setEmail(""); setDept([]); setError("") }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError(email ? "メールアドレスの形式が正しくありません。" : "メールアドレスを入力してください。")
      input.current?.focus()
      return
    }
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      close()
      toaster.success({ title: "招待メールを送信しました", description: email })
    }, 800)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(d) => (d.open ? onOpenChange(true) : close())} initialFocusEl={() => input.current}>
      <Dialog.Content>
        <Dialog.Title>メンバーを招待</Dialog.Title>
        <form noValidate onSubmit={submit}>
          <VStack gap={6}>
            <Field.Root required invalid={!!error}>
              <Field.Label>メールアドレス<Field.RequiredIndicator /></Field.Label>
              <Field.Input ref={input} type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
              <Field.ErrorText>{error}</Field.ErrorText>
            </Field.Root>

            <Select.Root collection={depts} value={dept} onValueChange={(d) => setDept(d.value)}>
              <Select.Label data-optional>部署</Select.Label>
              <Select.Trigger>
                <Select.ValueText placeholder="選択してください" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Content>
                {depts.items.map((d) => (
                  <Select.Item key={d.value} item={d}>
                    <Select.ItemText>{d.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <RadioGroup label="権限" defaultValue="member">
              {(Object.keys(roleLabel) as Role[]).map((r) => (
                <RadioGroup.Item key={r} value={r}>{roleLabel[r]}</RadioGroup.Item>
              ))}
            </RadioGroup>

            <Actions>
              <Button variant="ghost" onClick={close}>キャンセル</Button>
              <Button type="submit" loading={busy} loadingLabel="送信中">招待する</Button>
            </Actions>
          </VStack>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
