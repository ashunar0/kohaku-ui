import {
  Actions, Affix, Alert, Badge, Breadcrumbs, Button, HStack, Link, Spinner, Tag, VisuallyHidden, VStack, Card, Checkbox, Collapsible, DatePicker, Dialog, Field, Group,
  FileUpload, Icon, IconButton, Input, PasswordInput, Menu, Pagination, RadioGroup, Popover, Progress, Select, Switch, Table, Tabs, Toaster, Tooltip,
  createListCollection, createToaster, parseDate,
} from "@kohaku/react"
import { useEffect, useState } from "react"

const plans = createListCollection({
  items: [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Enterprise", value: "enterprise" },
  ],
})

const toaster = createToaster({ placement: "bottom-end", overlap: true })

const h2 = {
  fontSize: ".75rem", textTransform: "uppercase" as const, letterSpacing: ".08em",
  color: "var(--kh-color-fg-muted)", margin: "2.5rem 0 .75rem", fontWeight: 600,
}

const SearchGlyph = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>

export function App() {
  const [invalid, setInvalid] = useState(false)
  const [saving, setSaving] = useState(false)
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
        position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: ".75rem",
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

      <h2 style={{ ...h2, marginTop: 0 }}>PasswordInput — 右端のボタンで表示を切り替える。Tab で止まる</h2>
      <div style={{ display: "grid", gap: "1rem", maxWidth: "20rem" }}>
        <PasswordInput label="パスワード" defaultValue="abcd1234" autoComplete="current-password" />
        <Field.Root invalid required>
          <Field.Label>新しいパスワード<Field.RequiredIndicator /></Field.Label>
          <PasswordInput autoComplete="new-password" />
          <Field.ErrorText>8 文字以上で入力してください。</Field.ErrorText>
        </Field.Root>
      </div>

      <h2 style={h2}>Input numeric — 金額・数量。右寄せ・等幅数字・数字用の縦位置</h2>
      <HStack gap={6}>
        <Group><Input numeric defaultValue="12,800" aria-label="金額" style={{ width: "10rem" }} /><Affix>円</Affix></Group>
        <Group><Input numeric defaultValue="3" aria-label="数量" style={{ width: "5rem" }} /><Affix>個</Affix></Group>
        <Input defaultValue="交通費" aria-label="科目" style={{ width: "10rem" }} />
      </HStack>

      <h2 style={h2}>Button loading — 文字をくるくるに入れ替える。幅は変わらない</h2>
      <HStack>
        <Button variant="outline" loading>差し戻す</Button>
        <Button loading loadingLabel="承認中">承認する</Button>
        <IconButton variant="ghost" label="ヘルプ" loading>{SearchGlyph}</IconButton>
        <Button onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1500) }} loading={saving}>押すと 1.5 秒</Button>
      </HStack>

      <h2 style={h2}>VisuallyHidden — 画面に出さず読み上げにだけ出す</h2>
      <p style={{ margin: 0, fontSize: ".875rem" }}>
        この文の後ろに、読み上げにだけ出る文があります。<VisuallyHidden>（ここは画面には出ません）</VisuallyHidden>
      </p>

      <h2 style={h2}>Tag — 選んだ値の札。onRemove で外すボタンが出る</h2>
      <HStack>
        <Tag type="状態" onRemove={() => toaster.create({ title: "状態の条件を外しました" })}>承認待ち</Tag>
        <Tag type="部署" onRemove={() => {}}>営業部</Tag>
        <Tag onRemove={() => {}}>タクシー</Tag>
        <Tag type="期間">11/1〜11/30</Tag>
      </HStack>

      <h2 style={h2}>VStack / HStack — 間隔は kohaku の間隔トークンの番号</h2>
      <VStack gap={6} style={{ fontSize: ".875rem" }}>
        <HStack>
          <span style={{ padding: ".5rem .75rem", border: "1px dashed var(--kh-color-border-strong)", borderRadius: ".25rem" }}>HStack</span><span style={{ padding: ".5rem .75rem", border: "1px dashed var(--kh-color-border-strong)", borderRadius: ".25rem" }}>既定は 8px</span><span style={{ padding: ".5rem .75rem", border: "1px dashed var(--kh-color-border-strong)", borderRadius: ".25rem" }}>縦は中央</span>
        </HStack>
        <HStack gap={4} justify="between">
          <span style={{ padding: ".5rem .75rem", border: "1px dashed var(--kh-color-border-strong)", borderRadius: ".25rem" }}>gap=4</span><span style={{ padding: ".5rem .75rem", border: "1px dashed var(--kh-color-border-strong)", borderRadius: ".25rem" }}>justify=between</span>
        </HStack>
        <VStack>
          <span style={{ padding: ".5rem .75rem", border: "1px dashed var(--kh-color-border-strong)", borderRadius: ".25rem" }}>入れ子の VStack</span><span style={{ padding: ".5rem .75rem", border: "1px dashed var(--kh-color-border-strong)", borderRadius: ".25rem" }}>外が gap=6 でも既定の 16px</span>
        </VStack>
      </VStack>

      <h2 style={h2}>Spinner — role="status" と読み上げの文言を持つ</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: ".875rem" }}>
        <Spinner size="sm" /><Spinner /><Spinner size="lg" />
        <span style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "var(--kh-color-fg-muted)" }}>
          <Spinner size="sm" label="申請の一覧を読み込み中" />読み込み中…
        </span>
      </div>

      <h2 style={h2}>Link — 常に下線。表の行を開くボタンは asChild</h2>
      <div style={{ display: "grid", gap: ".75rem", fontSize: ".875rem" }}>
        <p style={{ margin: 0 }}>
          交通費は<Link href="#">経費精算の規程</Link>に沿って申請してください。
        </p>
        <p style={{ margin: 0 }}>
          <Link asChild><button type="button" onClick={() => toaster.create({ title: "EX-1042 を開きました" })}>EX-1042</button></Link>
        </p>
      </div>

      <h2 style={h2}>Breadcrumbs — nav / ol と区切りは隠れている</h2>
      <div style={{ display: "grid", gap: "1rem" }}>
        <Breadcrumbs>
          <Breadcrumbs.Item href="#">ホーム</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">経費申請</Breadcrumbs.Item>
          <Breadcrumbs.Item current>EX-1042</Breadcrumbs.Item>
        </Breadcrumbs>
        <Breadcrumbs style={{ maxWidth: "20rem" }}>
          <Breadcrumbs.Item href="#">ホーム</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">組織の設定</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">部署とメンバー</Breadcrumbs.Item>
          <Breadcrumbs.Item current>マーケティング部の承認ルート</Breadcrumbs.Item>
        </Breadcrumbs>
      </div>

      <h2 style={h2}>DatePicker — 入力欄とカレンダーの組み立ては隠れている</h2>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "end" }}>
        <DatePicker label="申請日" />
        <DatePicker
          label="期間"
          selectionMode="range"
          defaultValue={[parseDate("2026-11-03"), parseDate("2026-11-13")]}
        />
      </div>

      <h2 style={h2}>Table — 素の table を包むだけ。行は 48px にそろう</h2>
      <Table>
        <thead>
          <tr>
            <th scope="col"><Checkbox aria-label="すべて選択" /></th>
            <th scope="col" data-fit>番号</th>
            <th scope="col">名前</th>
            <th scope="col" data-numeric>金額</th>
            <th scope="col" data-fit>状態</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Checkbox aria-label="EX-1042 を選択" /></td>
            <td data-fit>EX-1042</td>
            <td>佐藤 美咲</td>
            <td data-numeric>¥12,800</td>
            <td data-fit><Badge variant="warning">承認待ち</Badge></td>
          </tr>
          <tr data-selected="">
            <td><Checkbox defaultChecked aria-label="EX-1041 を選択" /></td>
            <td data-fit>EX-1041</td>
            <td>田中 健太</td>
            <td data-numeric>¥3,240</td>
            <td data-fit><Badge variant="success">承認済み</Badge></td>
          </tr>
        </tbody>
      </Table>

      <h2 style={h2}>Menu — Portal / Positioner は隠れている</h2>
      <Menu.Root positioning={{ placement: "bottom-start" }}>
        <Menu.Trigger asChild><Button variant="outline">操作</Button></Menu.Trigger>
        <Menu.Content>
          <Menu.Item value="view">内容を見る</Menu.Item>
          <Menu.Item value="copy">複製する</Menu.Item>
          <Menu.Separator />
          <Menu.Item value="archive" disabled>アーカイブ</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <h2 style={h2}>IconButton — 正方形になる。label は必須</h2>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
        {(["solid", "outline", "ghost", "danger"] as const).map((v) => (
          <IconButton key={v} variant={v} label={`${v} の操作`}>
            <Icon><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>
          </IconButton>
        ))}
        {(["xs", "sm", "md", "lg"] as const).map((sz) => (
          <IconButton key={sz} variant="outline" size={sz} label={`${sz} の操作`}>
            <Icon><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>
          </IconButton>
        ))}
        {/* 円にしたいときは L3 で 1 行 */}
        <IconButton variant="ghost" label="円形" style={{ "--kh-button-radius": "var(--kh-radius-full)" } as never}>
          <Icon><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>
        </IconButton>
        <Button variant="outline">文字のボタンと並べる</Button>
      </div>

      <h2 style={h2}>Icon — asChild なら外の svg に data-* を足すだけ</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* 1. パスを children に書く（kohaku が svg を出す） */}
        <Icon size="xl"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>
        {/* 2. asChild。Lucide のように自分で svg を出すものはこちら */}
        <Icon size="xl" asChild>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </Icon>
        <span style={{ fontSize: ".75rem", color: "var(--kh-color-fg-faint)" }}>children / asChild（同じ大きさになる）</span>
      </div>

      <h2 style={h2}>File Upload — 一覧と却下理由は隠れている</h2>
      <div style={{ display: "grid", gap: "1.5rem", maxWidth: "28rem" }}>
        <FileUpload label="添付ファイル" maxFiles={3} maxFileSize={1024 * 1024} />
        <FileUpload label="画像だけ" accept="image/*" />
        <FileUpload label="無効" disabled />
      </div>

      <h2 style={h2}>Toast — Toaster が中身を組み立てる</h2>
      <Toaster toaster={toaster} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
        <Button variant="outline" size="sm" onClick={() => toaster.create({ title: "下書きを保存しました" })}>info（既定）</Button>
        <Button variant="outline" size="sm" onClick={() => toaster.success({ title: "保存しました", description: "変更は全員に反映されます。" })}>success</Button>
        <Button variant="outline" size="sm" onClick={() => toaster.warning({ title: "まもなくセッションが切れます" })}>warning</Button>
        <Button variant="outline" size="sm" onClick={() => toaster.error({ title: "保存できませんでした", description: "通信が切れています。時間をおいてもう一度お試しください。" })}>error</Button>
        <Button variant="outline" size="sm" onClick={() => toaster.create({ title: "3 件を削除しました", action: { label: "元に戻す", onClick: () => {} } })}>action</Button>
        <Button variant="outline" size="sm" onClick={() => toaster.promise(new Promise((r) => setTimeout(r, 2000)), {
          loading: { title: "アップロード中…" }, success: { title: "アップロードしました" }, error: { title: "失敗しました" },
        })}>loading → success</Button>
      </div>

      <h2 style={h2}>Pagination — ページ番号の並びは隠れている</h2>
      <div style={{ display: "grid", gap: "1rem" }}>
        <Pagination count={200} pageSize={10} defaultPage={1} />
        <Pagination count={200} pageSize={10} defaultPage={10} showEdges />
        <Pagination count={200} pageSize={10} defaultPage={20} />
        <Pagination count={50} pageSize={10} type="link" getPageUrl={({ page }) => `#page=${page}`} />
      </div>

      <h2 style={h2}>Progress — Track / Range は隠れている</h2>
      <div style={{ display: "grid", gap: "1.25rem", maxWidth: "28rem" }}>
        <Progress label="アップロード中" showValue defaultValue={40} />
        <Progress label="完了" showValue defaultValue={100} />
        <Progress label="読み込み中（終わりが分からない）" defaultValue={null} />
        <Progress aria-label="ラベルなし" defaultValue={70} />
      </div>

      <h2 style={h2}>Collapsible（Ark をそのまま再輸出）</h2>
      <Collapsible.Root>
        <Collapsible.Trigger>
          詳細な条件<Collapsible.Indicator />
        </Collapsible.Trigger>
        <Collapsible.Content>
          <p style={{ margin: 0, paddingTop: ".5rem", fontSize: ".875rem" }}>
            登録日・最終ログイン・所属部署で絞り込めます。条件は保存され、次に開いたときも残ります。
          </p>
        </Collapsible.Content>
      </Collapsible.Root>

      <h2 style={h2}>Popover — Portal / Positioner は隠れている</h2>
      <Popover.Root positioning={{ placement: "bottom-start" }}>
        <Popover.Trigger asChild>
          <Button variant="outline">表示項目</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Title>表示する列</Popover.Title>
          <Popover.Description>一覧に出す列を選んでください。</Popover.Description>
          <div style={{ display: "grid", gap: ".5rem", marginTop: ".75rem" }}>
            <Checkbox defaultChecked>氏名</Checkbox>
            <Checkbox defaultChecked>メールアドレス</Checkbox>
            <Checkbox>最終ログイン</Checkbox>
          </div>
        </Popover.Content>
      </Popover.Root>

      <h2 style={h2}>Tooltip — Portal / Positioner は隠れている</h2>
      <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button variant="outline">エクスポート</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>CSV でダウンロード</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button variant="ghost">招待</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>メンバーを招待するには管理者の権限が必要です。権限は組織の設定から変更できます。</Tooltip.Content>
        </Tooltip.Root>
      </div>

      <h2 style={h2}>Tabs（Ark をそのまま再輸出）</h2>
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">概要</Tabs.Trigger>
          <Tabs.Trigger value="members">メンバー</Tabs.Trigger>
          <Tabs.Trigger value="billing">請求</Tabs.Trigger>
          <Tabs.Trigger value="audit" disabled>監査ログ</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">
          <p style={{ margin: 0, fontSize: ".875rem" }}>組織の基本情報と、契約中のプランを表示します。</p>
        </Tabs.Content>
        <Tabs.Content value="members">
          <p style={{ margin: 0, fontSize: ".875rem" }}>招待済みのメンバーは 12 人です。</p>
        </Tabs.Content>
        <Tabs.Content value="billing">
          <p style={{ margin: 0, fontSize: ".875rem" }}>次回の請求日は 11 月 25 日です。</p>
        </Tabs.Content>
      </Tabs.Root>

      <h2 style={h2}>Checkbox / Switch / Radio（@kohaku/react）</h2>
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

        <div style={{ display: "grid", gap: "1rem", maxWidth: "28rem" }}>
          <Switch defaultChecked description="URL を知っている人なら誰でも見られます。">ワークスペースを公開する</Switch>
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
        <Input type="search" icon={SearchGlyph} placeholder="申請・メンバーを検索" aria-label="検索" />
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

