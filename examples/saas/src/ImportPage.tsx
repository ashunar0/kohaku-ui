import { useEffect, useState } from "react"
import {
  Actions,
  Alert,
  Badge,
  Button,
  Checkbox,
  Field,
  FileUpload,
  Progress,
  Select,
  Stepper,
  Table,
  VStack,
  createListCollection,
} from "@kohaku/react"
import { formatDate, yen } from "./data"

/* カード明細の取り込み（#/import）。段階を進める画面（Ark の Steps）・読み込み中の Progress・
   取り込めない行の出し方で kohaku の穴を探すための画面 */

const cards = createListCollection({
  items: ["法人カード（**** 1234）", "法人カード（**** 5678）"].map((c) => ({ label: c, value: c })),
})

const categories = createListCollection({
  items: ["交通費", "宿泊費", "接待交際費", "書籍", "備品", "ソフトウェア", "通信費", "広告費"].map((c) => ({ label: c, value: c })),
})

type Row = { id: string; date: string; payee: string; amount: number; category: string; state: "new" | "imported" | "error"; reason?: string }

/* 読み込んだ結果。examples なのでファイルの中身は読まず、いつもこれを返す */
const parsed: Row[] = [
  { id: "r1", date: "2026-10-01", payee: "JR東日本", amount: 1_340, category: "交通費", state: "new" },
  { id: "r2", date: "2026-10-03", payee: "Amazon Web Services", amount: 48_210, category: "通信費", state: "new" },
  { id: "r3", date: "2026-10-05", payee: "東京ステーションホテル", amount: 24_600, category: "宿泊費", state: "imported" },
  { id: "r4", date: "2026-10-08", payee: "紀伊國屋書店", amount: 3_960, category: "書籍", state: "new" },
  { id: "r5", date: "2026-10-12", payee: "Google Ads", amount: 110_000, category: "広告費", state: "new" },
  { id: "r6", date: "2026-10-15", payee: "タクシー（日本交通）", amount: 2_870, category: "交通費", state: "new" },
  { id: "r7", date: "2026-10-18", payee: "ヨドバシカメラ", amount: 0, category: "", state: "error", reason: "金額が読み取れません" },
  { id: "r8", date: "2026-10-22", payee: "Figma", amount: 5_400, category: "ソフトウェア", state: "new" },
  { id: "r9", date: "2026-10-26", payee: "銀座 鮨 かねさか", amount: 38_500, category: "接待交際費", state: "new" },
]

const stepNames = ["ファイル選択", "内容確認", "完了"]

export function ImportPage() {
  const [step, setStep] = useState(0)
  const [card, setCard] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState(0)
  const [rows, setRows] = useState(parsed)
  const [picked, setPicked] = useState<string[]>(parsed.filter((r) => r.state === "new").map((r) => r.id))
  const [busy, setBusy] = useState(false)

  // 内容確認に入ったら読み込みを進める（examples なので時間で進めるだけ）
  useEffect(() => {
    if (step !== 1 || loaded >= 100) return
    const t = setTimeout(() => setLoaded((n) => Math.min(100, n + 20)), 200)
    return () => clearTimeout(t)
  }, [step, loaded])

  const next = () => {
    const e: Record<string, string> = {}
    if (!card.length) e.card = "カードを選択してください。"
    if (!files.length) e.file = "明細ファイルを選択してください。"
    setErrors(e)
    if (Object.keys(e).length) return
    setLoaded(0)
    setStep(1)
  }

  const importRows = () => {
    setBusy(true)
    setTimeout(() => { setBusy(false); setStep(2) }, 800)
  }

  const restart = () => { setStep(0); setCard([]); setFiles([]); setErrors({}); setLoaded(0) }

  const selectable = rows.filter((r) => r.state === "new")
  const allPicked = selectable.length > 0 && selectable.every((r) => picked.includes(r.id))
  const errorCount = rows.filter((r) => r.state === "error").length
  const importedCount = rows.filter((r) => r.state === "imported").length

  return (
    <VStack gap={4} className="page">
      <header className="page-head">
        <h1>カード明細の取り込み</h1>
      </header>

      <Stepper steps={stepNames} step={step} className="import-stepper">

        {/* ── 1. ファイル選択 ─────────────────────────── */}
        <Stepper.Content index={0}>
          <VStack gap={6} className="import-form">
            <Field.Root required invalid={!!errors.card}>
              <Select.Root collection={cards} value={card} onValueChange={(d) => setCard(d.value)}>
                <Select.Label>カード<Field.RequiredIndicator /></Select.Label>
                <Select.Trigger>
                  <Select.ValueText placeholder="選択してください" />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Content>
                  {cards.items.map((c) => (
                    <Select.Item key={c.value} item={c}>
                      <Select.ItemText>{c.label}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
                <Select.HiddenSelect />
              </Select.Root>
              <Field.ErrorText>{errors.card}</Field.ErrorText>
            </Field.Root>

            <Field.Root required invalid={!!errors.file}>
              <FileUpload
                label={<>明細ファイル<Field.RequiredIndicator /></>}
                accept=".csv,text/csv"
                maxFiles={1}
                acceptedFiles={files}
                onFileChange={(d) => setFiles(d.acceptedFiles)}
              />
              <Field.HelperText>対応形式：CSV</Field.HelperText>
              <Field.ErrorText>{errors.file}</Field.ErrorText>
            </Field.Root>

            <Actions align="start">
              <Button onClick={next}>次へ</Button>
            </Actions>
          </VStack>
        </Stepper.Content>

        {/* ── 2. 内容確認 ─────────────────────────────── */}
        <Stepper.Content index={1}>
          {loaded < 100 ? (
            <Progress label="明細を読み込み中" value={loaded} showValue className="import-progress" />
          ) : (
            <VStack gap={3}>
              {errorCount > 0 ? (
                <Alert.Root variant="danger">
                  <Alert.Icon />
                  <Alert.Title>{errorCount} 件は取り込めません</Alert.Title>
                  <Alert.Description>CSV ファイルを修正して、再度取り込んでください。</Alert.Description>
                </Alert.Root>
              ) : null}

              <Table>
                <thead>
                  <tr>
                    <th scope="col">
                      <Checkbox
                        checked={allPicked ? true : picked.length ? "indeterminate" : false}
                        onCheckedChange={(d) => setPicked(d.checked ? selectable.map((r) => r.id) : [])}
                        aria-label="取り込める明細をすべて選択"
                      />
                    </th>
                    <th scope="col" data-fit>利用日</th>
                    <th scope="col">利用先</th>
                    <th scope="col" data-numeric>金額</th>
                    <th scope="col">科目</th>
                    <th scope="col" data-fit>状態</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} data-selected={picked.includes(r.id) ? "" : undefined}>
                      <td>
                        <Checkbox
                          disabled={r.state !== "new"}
                          checked={picked.includes(r.id)}
                          onCheckedChange={(d) => setPicked((p) => (d.checked ? [...p, r.id] : p.filter((x) => x !== r.id)))}
                          aria-label={`${r.payee} を選択`}
                        />
                      </td>
                      <td data-fit>{formatDate(r.date)}</td>
                      <td>{r.payee}</td>
                      <td data-numeric>{r.state === "error" ? "—" : yen(r.amount)}</td>
                      <td>
                        {r.state === "new" ? (
                          <Select.Root
                            collection={categories}
                            value={r.category ? [r.category] : []}
                            onValueChange={(d) => setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, category: d.value[0] ?? "" } : x)))}
                          >
                            <Select.Trigger aria-label={`${r.payee} の科目`}>
                              <Select.ValueText placeholder="選択してください" />
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
                          </Select.Root>
                        ) : (
                          r.category || "—"
                        )}
                      </td>
                      <td data-fit>
                        {r.state === "imported" ? <Badge variant="neutral">取込済み</Badge> : null}
                        {r.state === "error" ? <Badge variant="danger">{r.reason}</Badge> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <p className="count">
                {rows.length} 件中 {picked.length} 件を選択{importedCount ? `（取込済み ${importedCount} 件）` : ""}
              </p>

              <Actions align="start">
                <Button variant="outline" onClick={() => setStep(0)}>戻る</Button>
                <Button loading={busy} loadingLabel="取り込み中" disabled={!picked.length} onClick={importRows}>
                  {picked.length} 件を取り込む
                </Button>
              </Actions>
            </VStack>
          )}
        </Stepper.Content>

        {/* ── 3. 完了 ─────────────────────────────────── */}
        <Stepper.Content index={2}>
          <VStack gap={4}>
            <p>{picked.length} 件を下書きとして取り込みました。</p>
            <Actions align="start">
              <Button asChild><a href="#/">経費申請の一覧へ</a></Button>
              <Button variant="outline" onClick={restart}>続けて取り込む</Button>
            </Actions>
          </VStack>
        </Stepper.Content>
      </Stepper>
    </VStack>
  )
}
