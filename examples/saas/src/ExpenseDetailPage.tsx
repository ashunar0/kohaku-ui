import { useRef, useState } from "react"
import {
  Actions,
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  Field,
  HStack,
  Link,
  Steps,
  VStack,
} from "@kohaku/react"
import { toaster } from "./App"
import { expenses, formatDate, statusLabel, yen, type Expense, type Status } from "./data"

/* 申請の詳細と承認（#/expenses/<申請番号>）。説明の並び・承認の流れ・差し戻しの理由で kohaku の穴を探すための画面 */

const statusVariant: Record<Status, "warning" | "success" | "danger" | undefined> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  draft: undefined,
}

const approverOf: Record<string, string> = {
  営業部: "中村 ひかり",
  開発部: "高橋 健",
  マーケティング: "伊藤 さくら",
  コーポレート: "田中 彩",
}

type Step = { name: string; who: string; state: "done" | "current" | "rejected" | "waiting"; date?: string }

const stepLabel: Record<Step["state"], string> = { done: "完了", current: "承認待ち", rejected: "差し戻し", waiting: "未着手" }

function flowOf(e: Expense): Step[] {
  const dept = approverOf[e.dept] ?? "田中 彩"
  const applied: Step = { name: "申請", who: e.applicant, state: e.status === "draft" ? "waiting" : "done", date: e.date }
  if (e.status === "draft") return [applied, { name: "部署承認", who: dept, state: "waiting" }, { name: "経理承認", who: "あさひ", state: "waiting" }]
  if (e.status === "rejected") return [applied, { name: "部署承認", who: dept, state: "rejected", date: e.date }, { name: "経理承認", who: "あさひ", state: "waiting" }]
  if (e.status === "approved") return [applied, { name: "部署承認", who: dept, state: "done", date: e.date }, { name: "経理承認", who: "あさひ", state: "done", date: e.date }]
  return [applied, { name: "部署承認", who: dept, state: "done", date: e.date }, { name: "経理承認", who: "あさひ", state: "current" }]
}

export function ExpenseDetailPage({ id }: { id: string }) {
  const e = expenses.find((x) => x.id === id)
  const [rejecting, setRejecting] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!e) {
    return (
      <VStack gap={4} className="page">
        <header className="page-head"><h1>申請が見つかりません</h1></header>
        <p><Link href="#/">経費申請の一覧に戻る</Link></p>
      </VStack>
    )
  }

  const approve = () => {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      toaster.success({ title: "承認しました", description: e.id })
    }, 800)
  }

  return (
    <VStack gap={4} className="page">
      <header className="page-head" data-kh="hstack" data-justify="between" data-gap="4">
        <HStack gap={3} wrap={false}>
          <h1 className="row-id">{e.id}</h1>
          <Badge variant={statusVariant[e.status]}>{statusLabel[e.status]}</Badge>
        </HStack>
        {e.status === "pending" ? (
          <Actions>
            <Button variant="outline" onClick={() => setRejecting(true)}>差し戻す</Button>
            <Button loading={busy} loadingLabel="承認中" onClick={approve}>承認する</Button>
          </Actions>
        ) : null}
      </header>

      <div className="detail-layout">
        <VStack gap={4}>
          <Card.Root>
            <Card.Header>
              <Card.Title>申請内容</Card.Title>
            </Card.Header>
            <Card.Body>
              <dl className="spec">
                <div>
                  <dt>申請者</dt>
                  <dd>
                    <HStack gap={2} wrap={false}>
                      <Avatar name={e.applicant} />
                      <span>{e.applicant}</span>
                    </HStack>
                  </dd>
                </div>
                <div><dt>部署</dt><dd>{e.dept}</dd></div>
                <div><dt>申請日</dt><dd>{formatDate(e.date)}</dd></div>
                <div><dt>科目</dt><dd>{e.category}</dd></div>
                <div><dt>金額</dt><dd className="spec-amount">{yen(e.amount)}</dd></div>
                <div className="spec-wide"><dt>摘要</dt><dd>{e.note}</dd></div>
              </dl>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title>領収書</Card.Title>
            </Card.Header>
            <Card.Body>
              {e.receipts === 0 ? (
                <p className="muted">添付されていません。</p>
              ) : (
                <ul className="receipts">
                  {Array.from({ length: e.receipts }, (_, i) => (
                    <li key={i}>
                      <span>{`receipt-${i + 1}.jpg`}</span>
                      <Link href="#" onClick={(ev) => ev.preventDefault()}>表示</Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card.Root>
        </VStack>

        <Card.Root>
          <Card.Header>
            <Card.Title>承認経路</Card.Title>
          </Card.Header>
          <Card.Body>
            <Steps>
              {flowOf(e).map((s) => (
                <Steps.Item key={s.name} state={s.state}>
                  <HStack gap={3} justify="between" align="baseline" wrap={false}>
                    <span>
                      {s.name}
                      <span className="muted step-who">{s.who}{s.date ? `・${formatDate(s.date)}` : ""}</span>
                    </span>
                    <span className="muted">{stepLabel[s.state]}</span>
                  </HStack>
                </Steps.Item>
              ))}
            </Steps>
          </Card.Body>
        </Card.Root>
      </div>

      <Reject open={rejecting} onOpenChange={setRejecting} id={e.id} />
    </VStack>
  )
}

/* ── 差し戻し ─────────────────────────────────── */
function Reject({ open, onOpenChange, id }: { open: boolean; onOpenChange: (open: boolean) => void; id: string }) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")
  const input = useRef<HTMLTextAreaElement>(null)

  const close = () => { onOpenChange(false); setReason(""); setError("") }

  return (
    <Dialog.Root open={open} onOpenChange={(d) => (d.open ? onOpenChange(true) : close())} initialFocusEl={() => input.current}>
      <Dialog.Content>
        <Dialog.Title>差し戻す</Dialog.Title>
        <Field.Root required invalid={!!error}>
          <Field.Label>理由<Field.RequiredIndicator /></Field.Label>
          <Field.Textarea ref={input} rows={4} value={reason} onChange={(ev) => setReason(ev.currentTarget.value)} />
          <Field.HelperText>申請者に通知されます。</Field.HelperText>
          <Field.ErrorText>{error}</Field.ErrorText>
        </Field.Root>
        <Actions>
          <Button variant="ghost" onClick={close}>キャンセル</Button>
          <Button
            onClick={() => {
              if (!reason.trim()) { setError("理由を入力してください。"); input.current?.focus(); return }
              close()
              toaster.create({ title: "差し戻しました", description: id })
            }}
          >
            差し戻す
          </Button>
        </Actions>
      </Dialog.Content>
    </Dialog.Root>
  )
}
