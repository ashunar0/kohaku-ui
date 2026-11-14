import { useMemo, useState } from "react"
import {
  Actions,
  Badge,
  Button,
  Card,
  Checkbox,
  DatePicker,
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
import { expenses, formatDate, statusLabel, yen, type Status } from "./data"

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

  // 見出しの下は 16px、まとまり（数字 / 一覧）の間は 32px、一覧の中（絞り込み・表・ページ送り）は 12px。
  // どこも同じ間隔だと、絞り込みがどの表に効くのか読めない
  return (
    <VStack gap={4} className="page">
      <header className="page-head" data-kh="hstack" data-justify="between" data-gap="4">
        <h1>経費申請</h1>
        <Actions>
          <Button variant="outline">
            <Icon asChild><Download /></Icon>
            CSV 出力
          </Button>
          <Button variant="outline" asChild><a href="#/import">明細の取り込み</a></Button>
          <Button asChild><a href="#/new">新規申請</a></Button>
        </Actions>
      </header>

      <VStack gap={8}>
      {/* ── サマリ ────────────────────────────────────────── */}
      <div className="stats">
        {[
          { label: "承認待ち", value: `${pendingCount} 件` },
          { label: "今月の確定額", value: yen(total) },
          { label: "差し戻し", value: `${rejectedCount} 件` },
        ].map((s) => (
          <Card.Root key={s.label}>
            <Card.Body>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.value}</p>
            </Card.Body>
          </Card.Root>
        ))}
      </div>

      <VStack gap={3}>
      {/* ── 絞り込み ──────────────────────────────────────── */}
      <HStack gap={3} className="filters">
        <Group attached>
          <Input
            placeholder="申請者・摘要・申請番号で検索"
            value={q}
            onChange={(e) => { setQ(e.currentTarget.value); setPage(1) }}
            aria-label="申請を検索"
          />
          <IconButton variant="outline" label="検索">
            <Icon asChild><Search /></Icon>
          </IconButton>
        </Group>

        {/* 絞り込み 3 つは 1 かたまり。狭いときは 3 つ一緒に次の行へ落とす（日付だけ落ちると取り残されて見える） */}
        <HStack gap={3} wrap={false}>
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
      </HStack>

      {/* ── 一括操作 ──────────────────────────────────────── */}
      {picked.length > 0 ? (
        <HStack gap={4} className="bulk">
          <span>{picked.length} 件を選択中</span>
          <Actions align="start">
            <Button size="sm" onClick={() => approve(picked)}>一括承認</Button>
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
              <th scope="col">部署</th>
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
                  <Link href={`#/expenses/${e.id}`} className="row-id">{e.id}</Link>
                </td>
                <td data-fit>{formatDate(e.date)}</td>
                <td>{e.applicant}</td>
                <td>{e.dept}</td>
                <td>{e.category}</td>
                <td data-numeric>{yen(e.amount)}</td>
                <td data-fit><Badge variant={statusVariant[e.status]}>{statusLabel[e.status]}</Badge></td>
                <td data-fit>
                  <Menu.Root
                    positioning={{ placement: "bottom-end" }}
                    onSelect={(d) => {
                      if (d.value === "view") location.hash = `#/expenses/${e.id}`
                      if (d.value === "approve") approve([e.id])
                      if (d.value === "reject") toaster.create({ title: "差し戻しました", description: e.id })
                      if (d.value === "delete") {
                        toaster.create({
                          title: "下書きを削除しました",
                          description: e.id,
                          action: { label: "取り消す", onClick: () => toaster.create({ title: "削除を取り消しました" }) },
                        })
                      }
                    }}
                  >
                    <Menu.Trigger asChild>
                      <IconButton size="sm" variant="ghost" label={`${e.id} の操作`}>
                        <Icon asChild><Ellipsis /></Icon>
                      </IconButton>
                    </Menu.Trigger>
                    <Menu.Content>
                      <Menu.Item value="view">詳細を表示</Menu.Item>
                      {e.status === "pending" ? (
                        <>
                          <Menu.Separator />
                          <Menu.Item value="approve">承認する</Menu.Item>
                          <Menu.Item value="reject">差し戻す</Menu.Item>
                        </>
                      ) : null}
                      {e.status === "draft" ? (
                        <>
                          <Menu.Separator />
                          <Menu.Item value="delete" variant="danger">削除する</Menu.Item>
                        </>
                      ) : null}
                    </Menu.Content>
                  </Menu.Root>
                </td>
              </tr>
            ))}
            {shown.length === 0 ? (
              <tr data-empty="">
                <td colSpan={9}>該当する申請はありません。</td>
              </tr>
            ) : null}
          </tbody>
      </Table>

      <HStack gap={4} justify="between" className="page-foot">
        <p className="count">
          {rows.length === 0
            ? "0 件"
            : `${rows.length} 件中 ${(page - 1) * PER_PAGE + 1}–${(page - 1) * PER_PAGE + shown.length} 件を表示`}
        </p>
        <Pagination
          count={rows.length}
          pageSize={PER_PAGE}
          page={page}
          onPageChange={(d) => setPage(d.page)}
          siblingCount={1}
        />
      </HStack>
      </VStack>
      </VStack>
    </VStack>
  )
}
