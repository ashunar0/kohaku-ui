import { useRef, useState, type FormEvent } from "react"
import {
  Actions,
  Affix,
  Alert,
  Button,
  Checkbox,
  Field,
  Fieldset,
  Group,
  Icon,
  Link,
  PasswordInput,
  RadioGroup,
  VStack,
} from "@kohaku/react"
import { Receipt } from "lucide-react"
import { toaster } from "./App"

/* 会員登録。項目の多いフォームで kohaku の穴を探すための画面。
   ログイン前の画面なのでサイドバーは出さない（#/signup）

   入力欄の id は Field.Root の id で決まる（エラーの一覧から飛ぶ先）。
   Ark の ids.control は名前に反して Field の外側の箱の id になるので使わない */

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県",
  "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県",
  "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
]

type Values = Record<string, string>

/** 入力欄の id と、エラーの一覧に出す名前。並びは画面の上から */
const fields: [id: string, label: string][] = [
  ["lastName", "姓"], ["firstName", "名"], ["lastKana", "セイ"], ["firstKana", "メイ"],
  ["birthYear", "生年月日の年"], ["birthMonth", "生年月日の月"], ["birthDay", "生年月日の日"],
  ["email", "メールアドレス"], ["tel", "電話番号"],
  ["postal", "郵便番号"], ["pref", "都道府県"], ["city", "市区町村"], ["street", "町名・番地"],
  ["company", "会社名"], ["password", "パスワード"], ["agree", "利用規約への同意"],
]

function validate(v: Values, plan: string, agree: boolean): Record<string, string> {
  const e: Record<string, string> = {}
  const need = (id: string, label: string) => { if (!v[id]?.trim()) e[id] = `${label}を入力してください。` }
  need("lastName", "姓"); need("firstName", "名")
  for (const [id, label] of [["lastKana", "セイ"], ["firstKana", "メイ"]] as const) {
    if (!v[id]?.trim()) e[id] = `${label}を入力してください。`
    else if (!/^[ァ-ヶー　 ]+$/.test(v[id])) e[id] = `${label}はカタカナで入力してください。`
  }
  if (!/^\d{4}$/.test(v.birthYear ?? "")) e.birthYear = "年は西暦 4 桁で入力してください。"
  if (!/^\d{1,2}$/.test(v.birthMonth ?? "") || +v.birthMonth < 1 || +v.birthMonth > 12) e.birthMonth = "月は 1〜12 で入力してください。"
  if (!/^\d{1,2}$/.test(v.birthDay ?? "") || +v.birthDay < 1 || +v.birthDay > 31) e.birthDay = "日は 1〜31 で入力してください。"
  if (!v.email?.trim()) e.email = "メールアドレスを入力してください。"
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) e.email = "メールアドレスの形式が正しくありません。"
  if (v.tel && !/^[\d-]{10,13}$/.test(v.tel)) e.tel = "電話番号は数字とハイフンで入力してください。"
  if (!/^\d{3}-?\d{4}$/.test(v.postal ?? "")) e.postal = "郵便番号は 7 桁の数字で入力してください。"
  if (!v.pref) e.pref = "都道府県を選んでください。"
  need("city", "市区町村"); need("street", "町名・番地")
  if (plan === "corp") need("company", "会社名")
  if ((v.password ?? "").length < 8) e.password = "パスワードは 8 文字以上で入力してください。"
  if (!agree) e.agree = "利用規約に同意してください。"
  return e
}

export function SignupPage() {
  const [v, setV] = useState<Values>({})
  const [plan, setPlan] = useState("personal")
  const [agree, setAgree] = useState(false)
  const [news, setNews] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const summary = useRef<HTMLDivElement>(null)

  const bind = (id: string) => ({
    value: v[id] ?? "",
    onChange: (e: { currentTarget: { value: string } }) => {
      // 値は先に読む。更新関数が走るころには React が currentTarget を外している
      const value = e.currentTarget.value
      setV((p) => ({ ...p, [id]: value }))
    },
  })
  const err = (id: string) => errors[id]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(v, plan, agree)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // エラーの一覧に移る。どこを直せばいいかを先に伝える（デジタル庁の方針）
      requestAnimationFrame(() => summary.current?.focus())
      return
    }
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      toaster.success({ title: "アカウントを作成しました", description: v.email })
    }, 1000)
  }

  const listed = fields.filter(([id]) => errors[id])

  return (
    <div className="signup">
      <header className="signup-brand">
        <Icon asChild><Receipt /></Icon>
        <span>Keihi</span>
      </header>

      <main className="signup-main">
        <form noValidate onSubmit={submit}>
          <VStack gap={8}>
            <div className="signup-head">
              <h1>アカウントを作成</h1>
              <p>入力は 5 分ほどで終わります。「必須」の項目は必ず入力してください。</p>
            </div>

            {listed.length > 0 ? (
              <Alert.Root variant="danger" ref={summary} tabIndex={-1} className="signup-summary">
                <Alert.Icon />
                <Alert.Title>{listed.length} 件の入力に問題があります</Alert.Title>
                <ul>
                  {listed.map(([id]) => (
                    <li key={id}>
                      <Link href={`#${id}`} onClick={(ev) => { ev.preventDefault(); document.getElementById(id)?.focus() }}>
                        {errors[id]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Alert.Root>
            ) : null}

            {/* ── お名前 ─────────────────────────────── */}
            <section className="signup-section">
              <h2>お名前</h2>
              <VStack gap={6}>
                <Fieldset.Root invalid={!!(err("lastName") || err("firstName"))}>
                  <Fieldset.Legend data-required>氏名</Fieldset.Legend>
                  <Group>
                    <Field.Root required invalid={!!err("lastName")} id="lastName">
                      <Field.Input placeholder="姓" aria-label="姓" autoComplete="family-name" {...bind("lastName")} />
                    </Field.Root>
                    <Field.Root required invalid={!!err("firstName")} id="firstName">
                      <Field.Input placeholder="名" aria-label="名" autoComplete="given-name" {...bind("firstName")} />
                    </Field.Root>
                  </Group>
                  {err("lastName") || err("firstName") ? (
                    <Fieldset.ErrorText>{err("lastName") ?? err("firstName")}</Fieldset.ErrorText>
                  ) : null}
                </Fieldset.Root>

                <Fieldset.Root invalid={!!(err("lastKana") || err("firstKana"))}>
                  <Fieldset.Legend data-required>氏名（カタカナ）</Fieldset.Legend>
                  <Group>
                    <Field.Root required invalid={!!err("lastKana")} id="lastKana">
                      <Field.Input placeholder="セイ" aria-label="セイ" {...bind("lastKana")} />
                    </Field.Root>
                    <Field.Root required invalid={!!err("firstKana")} id="firstKana">
                      <Field.Input placeholder="メイ" aria-label="メイ" {...bind("firstKana")} />
                    </Field.Root>
                  </Group>
                  {err("lastKana") || err("firstKana") ? (
                    <Fieldset.ErrorText>{err("lastKana") ?? err("firstKana")}</Fieldset.ErrorText>
                  ) : null}
                </Fieldset.Root>

                <Fieldset.Root invalid={!!(err("birthYear") || err("birthMonth") || err("birthDay"))}>
                  <Fieldset.Legend data-required>生年月日</Fieldset.Legend>
                  <Group>
                    <Field.Root required invalid={!!err("birthYear")} id="birthYear" style={{ flex: "0 0 5rem" }}>
                      <Field.Input data-numeric="" inputMode="numeric" autoComplete="bday-year" aria-label="年" {...bind("birthYear")} />
                    </Field.Root>
                    <Affix>年</Affix>
                    <Field.Root required invalid={!!err("birthMonth")} id="birthMonth" style={{ flex: "0 0 3.5rem" }}>
                      <Field.Input data-numeric="" inputMode="numeric" autoComplete="bday-month" aria-label="月" {...bind("birthMonth")} />
                    </Field.Root>
                    <Affix>月</Affix>
                    <Field.Root required invalid={!!err("birthDay")} id="birthDay" style={{ flex: "0 0 3.5rem" }}>
                      <Field.Input data-numeric="" inputMode="numeric" autoComplete="bday-day" aria-label="日" {...bind("birthDay")} />
                    </Field.Root>
                    <Affix>日</Affix>
                  </Group>
                  <Fieldset.HelperText>西暦で入力してください。</Fieldset.HelperText>
                  {err("birthYear") || err("birthMonth") || err("birthDay") ? (
                    <Fieldset.ErrorText>{err("birthYear") ?? err("birthMonth") ?? err("birthDay")}</Fieldset.ErrorText>
                  ) : null}
                </Fieldset.Root>
              </VStack>
            </section>

            {/* ── 連絡先 ─────────────────────────────── */}
            <section className="signup-section">
              <h2>連絡先</h2>
              <VStack gap={6}>
                <Field.Root required invalid={!!err("email")} id="email">
                  <Field.Label>メールアドレス<Field.RequiredIndicator /></Field.Label>
                  <Field.Input type="email" autoComplete="email" placeholder="asahi@example.com" {...bind("email")} />
                  <Field.HelperText>ログインと、お知らせの送り先に使います。</Field.HelperText>
                  <Field.ErrorText>{err("email")}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!err("tel")} id="tel" className="signup-narrow">
                  <Field.Label>電話番号</Field.Label>
                  <Field.Input type="tel" inputMode="tel" autoComplete="tel" placeholder="090-1234-5678" {...bind("tel")} />
                  <Field.HelperText>ハイフンはあってもなくてもかまいません。</Field.HelperText>
                  <Field.ErrorText>{err("tel")}</Field.ErrorText>
                </Field.Root>
              </VStack>
            </section>

            {/* ── 住所 ───────────────────────────────── */}
            <section className="signup-section">
              <h2>住所</h2>
              <VStack gap={6}>
                <Group>
                  <Field.Root required invalid={!!err("postal")} id="postal" style={{ flex: "0 0 8rem" }}>
                    <Field.Label>郵便番号<Field.RequiredIndicator /></Field.Label>
                    <Field.Input inputMode="numeric" autoComplete="postal-code" placeholder="123-4567" {...bind("postal")} />
                    <Field.ErrorText>{err("postal")}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root required invalid={!!err("pref")} id="pref" style={{ flex: "0 0 10rem" }}>
                    <Field.Label>都道府県<Field.RequiredIndicator /></Field.Label>
                    <Field.Select autoComplete="address-level1" {...bind("pref")}>
                      <option value="">選んでください</option>
                      {prefectures.map((p) => <option key={p}>{p}</option>)}
                    </Field.Select>
                    <Field.ErrorText>{err("pref")}</Field.ErrorText>
                  </Field.Root>
                </Group>

                <Field.Root required invalid={!!err("city")} id="city">
                  <Field.Label>市区町村<Field.RequiredIndicator /></Field.Label>
                  <Field.Input autoComplete="address-level2" placeholder="品川区" {...bind("city")} />
                  <Field.ErrorText>{err("city")}</Field.ErrorText>
                </Field.Root>

                <Field.Root required invalid={!!err("street")} id="street">
                  <Field.Label>町名・番地<Field.RequiredIndicator /></Field.Label>
                  <Field.Input autoComplete="address-line1" placeholder="大崎 1-2-1" {...bind("street")} />
                  <Field.ErrorText>{err("street")}</Field.ErrorText>
                </Field.Root>

                <Field.Root id="building">
                  <Field.Label>建物名・部屋番号</Field.Label>
                  <Field.Input autoComplete="address-line2" {...bind("building")} />
                </Field.Root>
              </VStack>
            </section>

            {/* ── ご利用の形態 ───────────────────────── */}
            <section className="signup-section">
              <h2>ご利用の形態</h2>
              <VStack gap={6}>
                <RadioGroup label="どなたが使いますか" value={plan} onValueChange={(d) => setPlan(d.value ?? "personal")}>
                  <RadioGroup.Item value="personal">個人（フリーランス・個人事業主）</RadioGroup.Item>
                  <RadioGroup.Item value="corp">法人</RadioGroup.Item>
                </RadioGroup>

                {plan === "corp" ? (
                  <Field.Root required invalid={!!err("company")} id="company">
                    <Field.Label>会社名<Field.RequiredIndicator /></Field.Label>
                    <Field.Input autoComplete="organization" placeholder="株式会社こはく" {...bind("company")} />
                    <Field.ErrorText>{err("company")}</Field.ErrorText>
                  </Field.Root>
                ) : null}
              </VStack>
            </section>

            {/* ── ログイン情報 ───────────────────────── */}
            <section className="signup-section">
              <h2>ログイン情報</h2>
              <Field.Root required invalid={!!err("password")} id="password">
                <Field.Label>パスワード<Field.RequiredIndicator /></Field.Label>
                <PasswordInput autoComplete="new-password" {...bind("password")} />
                <Field.HelperText>8 文字以上。英字と数字を混ぜると安全です。</Field.HelperText>
                <Field.ErrorText>{err("password")}</Field.ErrorText>
              </Field.Root>
            </section>

            {/* ── 同意と送信 ─────────────────────────── */}
            <VStack gap={4}>
              <Checkbox checked={news} onCheckedChange={(d) => setNews(d.checked === true)}>
                新しい機能のお知らせをメールで受け取る
              </Checkbox>
              <Field.Root invalid={!!err("agree")}>
                <Checkbox checked={agree} onCheckedChange={(d) => setAgree(d.checked === true)} ids={{ hiddenInput: "agree" }}>
                  <Link href="#" onClick={(ev) => ev.preventDefault()}>利用規約</Link>と
                  <Link href="#" onClick={(ev) => ev.preventDefault()}>プライバシーポリシー</Link>に同意する
                </Checkbox>
                <Field.ErrorText>{err("agree")}</Field.ErrorText>
              </Field.Root>
            </VStack>

            <Actions align="start">
              <Button type="submit" size="lg" loading={busy} loadingLabel="登録中">登録する</Button>
            </Actions>
          </VStack>
        </form>
      </main>
    </div>
  )
}
