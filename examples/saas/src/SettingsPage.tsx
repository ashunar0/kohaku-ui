import { useRef, useState, type FormEvent } from "react"
import {
  Actions,
  Alert,
  Button,
  Card,
  Dialog,
  Field,
  FileUpload,
  Select,
  Switch,
  Tabs,
  VStack,
  createListCollection,
} from "@kohaku/react"
import { toaster } from "./App"

/* 設定。まだ examples で使っていない部品（Tabs / Switch / Textarea / 危険な操作）で
   kohaku の穴を探すための画面（#/settings） */

const depts = createListCollection({
  items: ["経理部", "営業部", "開発部", "総務部"].map((d) => ({ label: d, value: d })),
})

const notices = [
  { id: "submitted", label: "承認依頼", when: "自分宛ての承認依頼が届いたとき" },
  { id: "approved", label: "承認結果", when: "自分の申請が承認または差し戻されたとき" },
  { id: "weekly", label: "週次レポート", when: "毎週月曜日に、前週の経費の集計" },
  { id: "news", label: "新機能のお知らせ", when: "Keihi の新機能や改善" },
]

export function SettingsPage() {
  // 見出しの下はほかの画面と同じ 16px に見せる。タブは高さ 40px の真ん中に文字があり、上の縁が見えないので、
  // 箱の間を 16px にすると文字まで 27px 離れて見える。文字までが 16px 前後になるよう 4px にする
  return (
    <VStack gap={1} className="page settings">
      <header className="page-head">
        <h1>設定</h1>
      </header>

      <Tabs.Root defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">プロフィール</Tabs.Trigger>
          <Tabs.Trigger value="notify">通知</Tabs.Trigger>
          <Tabs.Trigger value="account">アカウント</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile"><Profile /></Tabs.Content>
        <Tabs.Content value="notify"><Notify /></Tabs.Content>
        <Tabs.Content value="account"><Account /></Tabs.Content>
      </Tabs.Root>
    </VStack>
  )
}

/* ── プロフィール ─────────────────────────────── */
function Profile() {
  const [name, setName] = useState("あさひ")
  const [dept, setDept] = useState(["経理部"])
  const [bio, setBio] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError("表示名を入力してください。"); return }
    setError("")
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      toaster.success({ title: "プロフィールを保存しました" })
    }, 800)
  }

  return (
    <form noValidate onSubmit={submit} className="settings-form">
      <VStack gap={6}>
        <Field.Root required invalid={!!error}>
          <Field.Label>表示名<Field.RequiredIndicator /></Field.Label>
          <Field.Input value={name} onChange={(e) => setName(e.currentTarget.value)} />
          <Field.ErrorText>{error}</Field.ErrorText>
        </Field.Root>

        <Field.Root readOnly>
          <Field.Label>メールアドレス</Field.Label>
          <Field.Input value="asahi@example.com" />
          <Field.HelperText>変更が必要な場合は管理者にお問い合わせください。</Field.HelperText>
        </Field.Root>

        <Select.Root collection={depts} value={dept} onValueChange={(d) => setDept(d.value)}>
          <Select.Label>部署</Select.Label>
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
          <Select.HiddenSelect />
        </Select.Root>

        <Field.Root>
          <Field.Label>自己紹介</Field.Label>
          <Field.Textarea rows={4} value={bio} onChange={(e) => setBio(e.currentTarget.value)} />
          <Field.HelperText>{bio.length} / 200 文字</Field.HelperText>
        </Field.Root>

        <FileUpload label="プロフィール画像" accept="image/*" maxFiles={1} maxFileSize={2 * 1024 * 1024} />

        <Actions align="start">
          <Button type="submit" loading={busy} loadingLabel="保存中">保存する</Button>
        </Actions>
      </VStack>
    </form>
  )
}

/* ── 通知 ─────────────────────────────────────── */
function Notify() {
  const [on, setOn] = useState<Record<string, boolean>>({ submitted: true, approved: true, weekly: false, news: false })

  // 届く先（メール）と、各項目がいつ届くかは、名前だけでは読めないので書く
  return (
    <VStack gap={6} className="settings-form">
      <p className="page-desc">オンにした項目は、メール（asahi@example.com）でお知らせします。</p>
      {notices.map((n) => (
        <Switch
          key={n.id}
          checked={on[n.id]}
          description={n.when}
          onCheckedChange={(d) => {
            setOn((p) => ({ ...p, [n.id]: d.checked }))
            toaster.create({ title: `「${n.label}」を${d.checked ? "オン" : "オフ"}にしました` })
          }}
        >
          {n.label}
        </Switch>
      ))}
    </VStack>
  )
}

/* ── アカウント ───────────────────────────────── */
function Account() {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState("")
  const title = useRef<HTMLHeadingElement>(null)
  const word = "削除する"

  return (
    <VStack gap={6} className="settings-form">
      <Card.Root>
        <Card.Header>
          <Card.Title>ログアウト</Card.Title>
        </Card.Header>
        <Card.Footer>
          <Actions align="start">
            <Button variant="outline" onClick={() => toaster.create({ title: "すべての端末からログアウトしました" })}>
              すべての端末からログアウト
            </Button>
          </Actions>
        </Card.Footer>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title>アカウントを削除</Card.Title>
          <Card.Description>申請履歴と添付ファイルもすべて削除されます。この操作は取り消せません。</Card.Description>
        </Card.Header>
        <Card.Footer>
          <Actions align="start">
            <Button variant="danger" onClick={() => setOpen(true)}>アカウントを削除</Button>
          </Actions>
        </Card.Footer>
      </Card.Root>

      <Dialog.Root
        role="alertdialog"
        open={open}
        onOpenChange={(d) => { setOpen(d.open); if (!d.open) setConfirm("") }}
        initialFocusEl={() => title.current}
      >
        <Dialog.Content>
          <Dialog.Title ref={title} tabIndex={-1}>アカウントを削除しますか</Dialog.Title>
          <Dialog.Description>申請履歴と添付ファイルもすべて削除されます。この操作は取り消せません。</Dialog.Description>

          <VStack gap={4}>
            <Alert.Root variant="danger">
              <Alert.Icon />
              <Alert.Title>承認待ちの申請が 3 件あります</Alert.Title>
              <Alert.Description>削除すると、これらの申請は取り下げられます。</Alert.Description>
            </Alert.Root>
            <Field.Root>
              <Field.Label>確認のため「{word}」と入力してください</Field.Label>
              <Field.Input value={confirm} onChange={(e) => setConfirm(e.currentTarget.value)} />
            </Field.Root>
          </VStack>

          <Actions>
            <Dialog.CloseTrigger asChild><Button variant="ghost">キャンセル</Button></Dialog.CloseTrigger>
            <Button
              variant="danger"
              disabled={confirm !== word}
              onClick={() => { setOpen(false); setConfirm(""); toaster.create({ title: "アカウントを削除しました" }) }}
            >
              削除する
            </Button>
          </Actions>
        </Dialog.Content>
      </Dialog.Root>
    </VStack>
  )
}
