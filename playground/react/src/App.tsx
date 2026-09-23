import {
  Actions, Alert, Badge, Button, Card, Checkbox, Dialog, Field, Group,
  Icon, Input, RadioGroup, Select, Switch, createListCollection,
} from "@kohaku/react"
import { useEffect, useState } from "react"

const plans = createListCollection({
  items: [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Enterprise", value: "enterprise" },
  ],
})

const h2 = {
  fontSize: ".75rem", textTransform: "uppercase" as const, letterSpacing: ".08em",
  color: "var(--kh-color-fg-muted)", margin: "2.5rem 0 .75rem", fontWeight: 600,
}

export function App() {
  const [invalid, setInvalid] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    // 地の色はページ側の責任。kohaku は body に何も指定しない
    document.body.style.background = "var(--kh-color-canvas)"
    document.body.style.color = "var(--kh-color-fg-body)"
    document.body.style.margin = "0"
  }, [theme])

  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "2rem 1rem 6rem" }}>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 .25rem" }}>kohaku — React playground</h1>
      <p style={{ color: "var(--kh-color-fg-muted)", fontSize: ".875rem", margin: "0 0 1rem" }}>
        @kohaku/react を使って書いたもの。DOM は素の Ark と同じになる
      </p>
      <div style={{
        position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", gap: ".75rem",
        padding: ".75rem 0", marginBottom: "1.5rem",
        background: "var(--kh-color-canvas)", borderBottom: "1px solid var(--kh-color-border)",
      }}>
        <Button variant="outline" size="sm" onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
          テーマ: {theme}
        </Button>
        <span style={{ fontSize: ".75rem", color: "var(--kh-color-fg-muted)" }}>
          dark は :root[data-theme="dark"] で L2 トークンだけ差し替わる
        </span>
      </div>

      <h2 style={{ ...h2, marginTop: 0 }}>Checkbox / Switch / Radio（@kohaku/react）</h2>
      <div style={{ display: "grid", gap: "1.25rem", maxWidth: "28rem" }}>
        <div style={{ display: "grid", gap: ".5rem" }}>
          <Checkbox defaultChecked>メールで通知を受け取る</Checkbox>
          <Checkbox>週次のダイジェストを送る</Checkbox>
          <Checkbox checked="indeterminate">一部のメンバーだけ選択中（indeterminate）</Checkbox>
          <Checkbox disabled>この設定は変更できません</Checkbox>
          <Checkbox invalid>利用規約に同意する（未同意 = invalid）</Checkbox>
          <Checkbox
            defaultChecked
            indicator={<Icon><path d="M12 2v20" /><path d="m19 9-7 7-7-7" /></Icon>}
          >
            indicator を渡すと既定のグリフが引っ込む
          </Checkbox>
        </div>

        <div style={{ display: "grid", gap: ".5rem" }}>
          <Switch defaultChecked>ワークスペースを公開する</Switch>
          <Switch>ゲストの招待を許可する</Switch>
          <Switch disabled>エンタープライズ機能（プラン外）</Switch>
        </div>

        <RadioGroup label="プラン" defaultValue="pro">
          {[["free","Free — 個人で試す"],["pro","Pro — チームで使う"],["ent","Enterprise — 監査ログつき"]].map(([v,l]) => (
            <RadioGroup.Item key={v} value={v}>{l}</RadioGroup.Item>
          ))}
        </RadioGroup>

        <RadioGroup label="支払い周期" defaultValue="month" orientation="horizontal">
          {[["month","毎月"],["year","毎年"]].map(([v,l]) => (
            <RadioGroup.Item key={v} value={v}>{l}</RadioGroup.Item>
          ))}
        </RadioGroup>
      </div>

      <h2 style={h2}>Button / Badge</h2>
      <Group>
        <Button>
          <Icon><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path d="M7 3v4a1 1 0 0 0 1 1h7" /></Icon>
          保存する
        </Button>
        <Button variant="outline">キャンセル</Button>
        <Button variant="ghost">あとで</Button>
        <Button variant="danger" size="sm">削除</Button>
        <Badge variant="success">公開中</Badge>
        <Badge variant="warning">承認待ち</Badge>
      </Group>

      <h2 style={h2}>Field（Ark）</h2>
      <div style={{ maxWidth: "24rem", display: "grid", gap: "1rem" }}>
        <Field.Root>
          <Field.Label>ワークスペース名</Field.Label>
          <Field.Input defaultValue="あさひの個人開発" />
          <Field.HelperText>あとから変更できます。</Field.HelperText>
        </Field.Root>

        <Field.Root invalid={invalid} required>
          <Field.Label>サブドメイン<Field.RequiredIndicator /></Field.Label>
          <Field.Input defaultValue="my workspace" />
          <Field.HelperText>半角英数字とハイフン。</Field.HelperText>
          <Field.ErrorText>使用できない文字が含まれています。</Field.ErrorText>
        </Field.Root>

        <Field.Root disabled>
          <Field.Label>プラン ID</Field.Label>
          <Field.Input defaultValue="plan_free" />
          <Field.HelperText>変更できません。</Field.HelperText>
        </Field.Root>

        <Button variant="outline" size="sm" onClick={() => setInvalid((v) => !v)}>
          invalid を切り替え（現在: {String(invalid)}）
        </Button>
      </div>

      <h2 style={h2}>Group / Input</h2>
      <div style={{ maxWidth: "28rem", display: "grid", gap: "1rem" }}>
        <Group>
          <Input placeholder="you@example.com" />
          <Button>招待する</Button>
        </Group>
        <Group attached>
          <Input placeholder="キーワードで検索" />
          <Button variant="outline">検索</Button>
        </Group>
      </div>

      <h2 style={h2}>Alert</h2>
      <div style={{ display: "grid", gap: ".75rem" }}>
        <Alert variant="info" title="メンテナンスのお知らせ">
          3 月 12 日 2:00〜4:00 の間、一部機能が利用できません。
        </Alert>
        <Alert variant="danger" tone="soft" title="支払いが確認できませんでした">
          3 日以内に更新されない場合、サービスが停止します。
        </Alert>
        <Alert variant="warning" title="容量が残りわずかです">
          80% を超えました。不要なファイルを削除してください。
        </Alert>
        <Alert variant="success" title="デプロイが完了しました">
          2 分 14 秒で 3 件の変更が反映されました。
        </Alert>
        <Alert
          variant="info"
          icon={<Icon><path d="M12 2v20" /><path d="m19 9-7 7-7-7" /></Icon>}
          title="icon を渡した場合はそちらが勝つ"
        >
          :empty が外れるので既定のグリフは引っ込む。
        </Alert>
      </div>

      <h2 style={h2}>Card</h2>
      <Card.Root>
        <Card.Header>
          <Card.Title>チームメンバー</Card.Title>
        </Card.Header>
        <Card.Body style={{ fontSize: ".875rem" }}>招待リンクは 7 日で失効します。</Card.Body>
        <Card.Footer>
          <Button variant="outline" size="sm">招待リンクを発行</Button>
        </Card.Footer>
      </Card.Root>

      <h2 style={h2}>Dialog — Portal / Backdrop / Positioner は隠れている</h2>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button>プロフィールを編集</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>プロフィールを編集</Dialog.Title>
          <Dialog.Description>変更内容はすぐに反映されます。</Dialog.Description>
          <Field.Root>
            <Field.Label>表示名</Field.Label>
            <Field.Input defaultValue="あさひ" />
          </Field.Root>
          <Actions>
            <Dialog.CloseTrigger asChild><Button variant="outline">キャンセル</Button></Dialog.CloseTrigger>
            <Dialog.CloseTrigger asChild><Button>保存する</Button></Dialog.CloseTrigger>
          </Actions>
        </Dialog.Content>
      </Dialog.Root>

      <h2 style={h2}>Select — Control / Portal / Positioner は隠れている</h2>
      <Select.Root collection={plans} defaultValue={["pro"]} style={{ maxWidth: "16rem" }}>
        <Select.Label>プラン</Select.Label>
        <Select.Trigger>
          <Select.ValueText placeholder="選択してください" />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Content>
          {plans.items.map((item) => (
            <Select.Item key={item.value} item={item}>
              <Select.ItemText>{item.label}</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  )
}
