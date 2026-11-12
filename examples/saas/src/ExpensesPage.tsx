import { useMemo, useState } from "react"
import {
  Actions,
  Badge,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Dialog,
  Field,
  Group,
  HStack,
  Icon,
  IconButton,
  Input,
  Link,
  Menu,
  Pagination,
  Select,
  Table,
  VisuallyHidden,
  VStack,
  createListCollection,
  parseDate,
} from "@kohaku/react"
import { Download, Ellipsis, Search } from "lucide-react"
import { toaster } from "./App"
import { expenses, formatDate, statusLabel, yen, type Expense, type Status } from "./data"

const PER_PAGE = 8

const statusVariant: Record<Status, "warning" | "success" | "danger" | "neutral"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  draft: "neutral",
}

const statusFilter = createListCollection({
  items: [
    { label: "すべての状態", value: "all" },
    { label: "承認待ち", value: "pending" },
    { label: "承認済み", value: "approved" },
    { label: "差し戻し", value: "rejected" },
    { label: "下書き", value: "draft" },
  ],
})

const deptFilter = createListCollection({
  items: [
    { label: "すべての部署", value: "all" },
    ...[...new Set(expenses.map((e) => e.dept))].map((d) => ({ label: d, value: d })),
  ],
})

export function ExpensesPage() {
  const [status, setStatus] = useState("all")
  const [dept, setDept] = useState("all")
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [picked, setPicked] = useState<string[]>([])
  const [open, setOpen] = useState<Expense | null>(null)

  const rows = useMemo(
    () =>
      expenses.filter(
        (e) =>
          (status === "all" || e.status === status) &&
          (dept === "all" || e.dept === dept) &&
          (q === "" || e.applicant.includes(q) || e.note.includes(q) || e.id.includes(q)),
      ),
    [status, dept, q],
  )
  const shown = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const pendingCount = expenses.filter((e) => e.status === "pending").length
  const total = expenses.filter((e) => e.status !== "draft").reduce((s, e) => s + e.amount, 0)
  const rejectedCount = expenses.filter((e) => e.status === "rejected").length

  const allPicked = shown.length > 0 && shown.every((e) => picked.includes(e.id))
  const somePicked = picked.length > 0 && !allPicked

  const approve = (ids: string[]) => {
    setPicked([])
    toaster.success({
      title: `${ids.length} 件を承認しました`,
      description: ids.length === 1 ? ids[0] : `${ids[0]} ほか ${ids.length - 1} 件`,
      action: { label: "取り消す", onClick: () => toaster.create({ title: "承認を取り消しました" }) },
    })
  }

  return (
    <VStack gap={5} className="page">
      <header className="page-head" data-kh="hstack" data-justify="between" data-align="end" data-gap="4">
        <div>
          <h1>経費申請</h1>
          <p>部署の申請を確認して承認します。</p>
        </div>
        <Actions>
          <Button variant="outline">
            <Icon asChild><Download /></Icon>
            CSV で書き出す
          </Button>
          <Button>新しい申請</Button>
        </Actions>
      </header>

      {/* ── サマリ ────────────────────────────────────────── */}
      <div className="stats">
        {[
          { label: "承認待ち", value: `${pendingCount} 件`, hint: "最も古い申請は 6 日前" },
          { label: "今月の確定額", value: yen(total), hint: "下書きを除く" },
          { label: "差し戻し", value: `${rejectedCount} 件`, hint: "申請者の対応待ち" },
        ].map((s) => (
          <Card.Root key={s.label}>
            <Card.Body>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.value}</p>
              <p className="stat-hint">{s.hint}</p>
            </Card.Body>
          </Card.Root>
        ))}
      </div>

      {/* ── 絞り込み ──────────────────────────────────────── */}
      <HStack gap={3} className="filters">
        <Group attached>
          <Input
            placeholder="申請者・摘要・申請番号で探す"
            value={q}
            onChange={(e) => { setQ(e.currentTarget.value); setPage(1) }}
            aria-label="申請を探す"
          />
          <IconButton variant="outline" label="探す">
            <Icon asChild><Search /></Icon>
          </IconButton>
        </Group>

        <Select.Root
          collection={statusFilter}
          value={[status]}
          onValueChange={(d) => { setStatus(d.value[0]); setPage(1) }}
        >
          <Select.Trigger>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Content>
            {statusFilter.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root
          collection={deptFilter}
          value={[dept]}
          onValueChange={(d) => { setDept(d.value[0]); setPage(1) }}
        >
          <Select.Trigger>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Content>
            {deptFilter.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <DatePicker
          selectionMode="range"
          defaultValue={[parseDate("2026-11-01"), parseDate("2026-11-30")]}
          inputLabels={["期間の開始日", "期間の終了日"]}
        />
      </HStack>

      {/* ── 一括操作 ──────────────────────────────────────── */}
      {picked.length > 0 ? (
        <HStack gap={4} className="bulk">
          <span>{picked.length} 件を選択中</span>
          <Actions align="start">
            <Button size="sm" onClick={() => approve(picked)}>まとめて承認</Button>
            <Button size="sm" variant="outline" onClick={() => setPicked([])}>選択を解除</Button>
          </Actions>
        </HStack>
      ) : null}

      {/* ── 一覧 ──────────────────────────────────────────── */}
      <Table>
          <thead>
            <tr>
              <th scope="col">
                <Checkbox
                  checked={allPicked ? true : somePicked ? "indeterminate" : false}
                  onCheckedChange={(d) => setPicked(d.checked ? shown.map((e) => e.id) : [])}
                  aria-label="表示中のすべてを選択"
                />
              </th>
              <th scope="col" data-fit>申請番号</th>
              <th scope="col" data-fit>申請日</th>
              <th scope="col">申請者</th>
              <th scope="col">科目</th>
              <th scope="col" data-numeric>金額</th>
              <th scope="col" data-fit>状態</th>
              <th scope="col" data-fit><VisuallyHidden>操作</VisuallyHidden></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((e) => (
              <tr key={e.id} data-selected={picked.includes(e.id) ? "" : undefined}>
                <td>
                  <Checkbox
                    checked={picked.includes(e.id)}
                    onCheckedChange={(d) =>
                      setPicked((p) => (d.checked ? [...p, e.id] : p.filter((x) => x !== e.id)))
                    }
                    aria-label={`${e.id} を選択`}
                  />
                </td>
                <td data-fit>
                  <Link asChild><button type="button" className="row-id" onClick={() => setOpen(e)}>{e.id}</button></Link>
                </td>
                <td data-fit>{formatDate(e.date)}</td>
                <td>
                  <VStack gap={0} className="who">
                    <strong>{e.applicant}</strong>
                    <small>{e.dept}</small>
                  </VStack>
                </td>
                <td>{e.category}</td>
                <td data-numeric>{yen(e.amount)}</td>
                <td data-fit><Badge variant={statusVariant[e.status]}>{statusLabel[e.status]}</Badge></td>
                <td data-fit>
                  <Menu.Root
                    positioning={{ placement: "bottom-end" }}
                    onSelect={(d) => {
                      if (d.value === "view") setOpen(e)
                      if (d.value === "approve") approve([e.id])
                      if (d.value === "reject") toaster.create({ title: "差し戻しました", description: e.id })
                    }}
                  >
                    <Menu.Trigger asChild>
                      <IconButton size="sm" variant="ghost" label={`${e.id} の操作`}>
                        <Icon asChild><Ellipsis /></Icon>
                      </IconButton>
                    </Menu.Trigger>
                    <Menu.Content>
                      <Menu.Item value="view">内容を見る</Menu.Item>
                      {e.status === "pending" ? (
                        <>
                          <Menu.Separator />
                          <Menu.Item value="approve">承認する</Menu.Item>
                          <Menu.Item value="reject">差し戻す</Menu.Item>
                        </>
                      ) : null}
                    </Menu.Content>
                  </Menu.Root>
                </td>
              </tr>
            ))}
            {shown.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty">条件に合う申請はありません。</td>
              </tr>
            ) : null}
          </tbody>
      </Table>

      <HStack gap={4} justify="between" className="page-foot">
        <p className="count">
          {rows.length} 件中 {shown.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–
          {(page - 1) * PER_PAGE + shown.length} 件を表示
        </p>
        <Pagination
          count={rows.length}
          pageSize={PER_PAGE}
          page={page}
          onPageChange={(d) => setPage(d.page)}
          siblingCount={1}
        />
      </HStack>

      {/* ── 詳細 ─────────────────────────────────────────── */}
      <Dialog.Root open={open != null} onOpenChange={(d) => !d.open && setOpen(null)}>
        <Dialog.Content>
          <Dialog.Title>{open?.id}</Dialog.Title>
          <Dialog.Description>
            {open ? `${open.applicant}（${open.dept}）が ${formatDate(open.date)} に申請` : ""}
          </Dialog.Description>

          <dl className="detail">
            <div><dt>科目</dt><dd>{open?.category}</dd></div>
            <div><dt>金額</dt><dd className="detail-amount">{open ? yen(open.amount) : ""}</dd></div>
            <div><dt>状態</dt><dd>{open ? <Badge variant={statusVariant[open.status]}>{statusLabel[open.status]}</Badge> : null}</dd></div>
            <div><dt>領収書</dt><dd>{open?.receipts} 枚</dd></div>
            <div className="detail-wide"><dt>摘要</dt><dd>{open?.note}</dd></div>
          </dl>

          <Field.Root>
            <Field.Label>コメント</Field.Label>
            <Field.Textarea rows={3} placeholder="差し戻す場合は理由を書いてください。" />
            <Field.HelperText>申請者に通知されます。</Field.HelperText>
          </Field.Root>

          <Actions>
            <Dialog.CloseTrigger asChild><Button variant="ghost">閉じる</Button></Dialog.CloseTrigger>
            <Button variant="outline" onClick={() => { setOpen(null); toaster.create({ title: "差し戻しました" }) }}>
              差し戻す
            </Button>
            <Button onClick={() => { const id = open!.id; setOpen(null); approve([id]) }}>承認する</Button>
          </Actions>
        </Dialog.Content>
      </Dialog.Root>
    </VStack>
  )
}
