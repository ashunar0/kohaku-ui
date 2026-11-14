import { useState, type FormEvent } from "react"
import {
  Actions,
  Affix,
  Alert,
  Button,
  DatePicker,
  Field,
  FileUpload,
  Group,
  RadioGroup,
  Select,
  VStack,
  createListCollection,
} from "@kohaku/react"
import type { DateValue } from "@ark-ui/react"
import { toaster } from "./App"

/* 経費の新しい申請（#/new）。日付・金額・区分・領収書を 1 つのフォームで組んで、
   kohaku の部品を混ぜたときの穴を探すための画面 */

const categories = createListCollection({
  items: ["交通費", "宿泊費", "接待交際費", "書籍", "備品", "ソフトウェア", "研修費", "通信費"]
    .map((c) => ({ label: c, value: c })),
})

const approvers = createListCollection({
  items: ["田中 彩（コーポレート）", "高橋 健（開発部）", "中村 ひかり（営業部）"].map((a) => ({ label: a, value: a })),
})

export function NewExpensePage() {
  const [date, setDate] = useState<DateValue[]>([])
  const [amount, setAmount] = useState("")
  const [payee, setPayee] = useState("")
  const [purpose, setPurpose] = useState("")
  const [category, setCategory] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!date.length) next.date = "利用日を入力してください。"
    if (!category.length) next.category = "区分を選んでください。"
    if (!amount.trim()) next.amount = "金額を入力してください。"
    if (!payee.trim()) next.payee = "支払先を入力してください。"
    if (!purpose.trim()) next.purpose = "目的を入力してください。"
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      toaster.success({ title: "申請しました", description: "承認されたらお知らせします。" })
    }, 800)
  }

  const count = Object.keys(errors).length

  return (
    <VStack gap={8} className="page new-expense">
      <header className="page-head">
        <h1>新しい申請</h1>
        <p>立て替えた経費を申請します。領収書は写真でも構いません。</p>
      </header>

      <form noValidate onSubmit={submit} className="new-expense-form">
        <VStack gap={6}>
          {count > 0 && (
            <Alert.Root variant="danger">
              <Alert.Icon />
              <Alert.Title>{count} 件の項目を直してください</Alert.Title>
            </Alert.Root>
          )}

          <Field.Root required invalid={!!errors.date}>
            <DatePicker label={<>利用日<Field.RequiredIndicator /></>} value={date} onValueChange={(d) => setDate(d.value)} />
            <Field.HelperText>領収書の日付です。</Field.HelperText>
            <Field.ErrorText>{errors.date}</Field.ErrorText>
          </Field.Root>

          {/* Select は Ark の Field と連携する（required / invalid / ラベルの紐付けを Field から受け取る） */}
          <Field.Root required invalid={!!errors.category}>
            <Select.Root collection={categories} value={category} onValueChange={(d) => setCategory(d.value)}>
              <Select.Label>区分<Field.RequiredIndicator /></Select.Label>
              <Select.Trigger>
                <Select.ValueText placeholder="選んでください" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Content>
                {categories.items.map((c) => (
                  <Select.Item key={c.value} item={c}>
                    <Select.ItemText>{c.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
              <Select.HiddenSelect />
            </Select.Root>
            <Field.ErrorText>{errors.category}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.amount}>
            <Field.Label>金額<Field.RequiredIndicator /></Field.Label>
            <Group>
              <Field.Input data-numeric="" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.currentTarget.value)} style={{ width: "12rem" }} />
              <Affix>円</Affix>
            </Group>
            <Field.HelperText>税込みの金額です。</Field.HelperText>
            <Field.ErrorText>{errors.amount}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.payee}>
            <Field.Label>支払先<Field.RequiredIndicator /></Field.Label>
            <Field.Input value={payee} onChange={(e) => setPayee(e.currentTarget.value)} />
            <Field.HelperText>領収書に書かれたお店や会社の名前です。</Field.HelperText>
            <Field.ErrorText>{errors.payee}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.purpose}>
            <Field.Label>目的<Field.RequiredIndicator /></Field.Label>
            <Field.Textarea rows={3} value={purpose} onChange={(e) => setPurpose(e.currentTarget.value)} />
            <Field.HelperText>誰と・何のために使ったかを書きます。</Field.HelperText>
            <Field.ErrorText>{errors.purpose}</Field.ErrorText>
          </Field.Root>

          <RadioGroup label="支払い方法" defaultValue="self">
            <RadioGroup.Item value="self">自分で立て替えた</RadioGroup.Item>
            <RadioGroup.Item value="card">法人カードで払った</RadioGroup.Item>
          </RadioGroup>

          <FileUpload label="領収書" accept="image/*,application/pdf" maxFiles={5} maxFileSize={10 * 1024 * 1024} />

          <Select.Root collection={approvers}>
            <Select.Label data-optional>承認者</Select.Label>
            <Select.Trigger>
              <Select.ValueText placeholder="部署の承認者に送ります" />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Content>
              {approvers.items.map((a) => (
                <Select.Item key={a.value} item={a}>
                  <Select.ItemText>{a.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
            <Select.HiddenSelect />
          </Select.Root>

          <Actions align="start">
            <Button type="submit" loading={busy} loadingLabel="申請中">申請する</Button>
            <Button type="button" variant="outline" onClick={() => toaster.create({ title: "下書きに保存しました" })}>
              下書きに保存
            </Button>
          </Actions>
        </VStack>
      </form>
    </VStack>
  )
}
