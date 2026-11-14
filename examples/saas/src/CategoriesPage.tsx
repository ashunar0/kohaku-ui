import { useRef, useState, type FormEvent } from "react"
import {
  Actions,
  Button,
  Dialog,
  Field,
  Group,
  Affix,
  Icon,
  IconButton,
  Menu,
  Select,
  Switch,
  Table,
  VisuallyHidden,
  VStack,
  createListCollection,
} from "@kohaku/react"
import { Ellipsis } from "lucide-react"
import { toaster } from "./App"
import { yen } from "./data"

/* 勘定科目の管理（#/categories）。表の中の Switch・追加のダイアログで kohaku の穴を探すための画面 */

const taxes = createListCollection({
  items: ["課税仕入 10%", "課税仕入 8%（軽減）", "非課税", "対象外"].map((t) => ({ label: t, value: t })),
})

type Category = { id: string; name: string; tax: string; limit: number | null; active: boolean }

const initial: Category[] = [
  ["交通費", "課税仕入 10%", null, true],
  ["宿泊費", "課税仕入 10%", 15_000, true],
  ["接待交際費", "課税仕入 10%", 10_000, true],
  ["会議費", "課税仕入 10%", 5_000, true],
  ["書籍", "課税仕入 10%", null, true],
  ["新聞図書費", "課税仕入 8%（軽減）", null, true],
  ["備品", "課税仕入 10%", 100_000, true],
  ["通信費", "課税仕入 10%", null, true],
  ["研修費", "課税仕入 10%", null, true],
  ["慶弔費", "対象外", 30_000, true],
  ["タクシー代（深夜）", "課税仕入 10%", null, false],
].map(([name, tax, limit, active], i) => ({ id: `c${i + 1}`, name: name as string, tax: tax as string, limit: limit as number | null, active: active as boolean }))

export function CategoriesPage() {
  const [items, setItems] = useState(initial)
  const [adding, setAdding] = useState(false)

  const toggle = (c: Category, active: boolean) => {
    setItems((xs) => xs.map((x) => (x.id === c.id ? { ...x, active } : x)))
    toaster.create({ title: `「${c.name}」を${active ? "有効" : "無効"}にしました` })
  }

  return (
    <VStack gap={4} className="page">
      <header className="page-head" data-kh="hstack" data-justify="between" data-gap="4">
        <h1>勘定科目</h1>
        <Button onClick={() => setAdding(true)}>科目を追加</Button>
      </header>

      <Table>
        <thead>
          <tr>
            <th scope="col">科目名</th>
            <th scope="col">税区分</th>
            <th scope="col" data-numeric>上限額（1 件あたり）</th>
            <th scope="col" data-fit>有効</th>
            <th scope="col" data-fit><VisuallyHidden>操作</VisuallyHidden></th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <th scope="row">{c.name}</th>
              <td>{c.tax}</td>
              <td data-numeric>{c.limit == null ? "—" : yen(c.limit)}</td>
              <td data-fit>
                <Switch checked={c.active} onCheckedChange={(d) => toggle(c, d.checked)} aria-label={`${c.name} を有効にする`} />
              </td>
              <td data-fit>
                <Menu.Root positioning={{ placement: "bottom-end" }}>
                  <Menu.Trigger asChild>
                    <IconButton size="sm" variant="ghost" label={`${c.name} の操作`}>
                      <Icon asChild><Ellipsis /></Icon>
                    </IconButton>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item value="edit">編集</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item value="delete" variant="danger">削除</Menu.Item>
                  </Menu.Content>
                </Menu.Root>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Add open={adding} onOpenChange={setAdding} onAdd={(c) => setItems((xs) => [...xs, c])} />
    </VStack>
  )
}

/* ── 追加 ─────────────────────────────────────── */
function Add({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (open: boolean) => void; onAdd: (c: Category) => void }) {
  const [name, setName] = useState("")
  const [tax, setTax] = useState<string[]>(["課税仕入 10%"])
  const [limit, setLimit] = useState("")
  const [error, setError] = useState("")
  const input = useRef<HTMLInputElement>(null)

  const close = () => { onOpenChange(false); setName(""); setTax(["課税仕入 10%"]); setLimit(""); setError("") }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError("科目名を入力してください。"); input.current?.focus(); return }
    onAdd({ id: `c${Date.now()}`, name: name.trim(), tax: tax[0], limit: limit ? Number(limit.replaceAll(",", "")) : null, active: true })
    toaster.success({ title: "科目を追加しました", description: name.trim() })
    close()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(d) => (d.open ? onOpenChange(true) : close())} initialFocusEl={() => input.current}>
      <Dialog.Content>
        <Dialog.Title>科目を追加</Dialog.Title>
        <form noValidate onSubmit={submit}>
          <VStack gap={6}>
            <Field.Root required invalid={!!error}>
              <Field.Label>科目名<Field.RequiredIndicator /></Field.Label>
              <Field.Input ref={input} value={name} onChange={(e) => setName(e.currentTarget.value)} />
              <Field.ErrorText>{error}</Field.ErrorText>
            </Field.Root>

            <Select.Root collection={taxes} value={tax} onValueChange={(d) => setTax(d.value)}>
              <Select.Label>税区分</Select.Label>
              <Select.Trigger>
                <Select.ValueText />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Content>
                {taxes.items.map((t) => (
                  <Select.Item key={t.value} item={t}>
                    <Select.ItemText>{t.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Field.Root>
              <Field.Label data-optional>上限額（1 件あたり）</Field.Label>
              <Group>
                <Field.Input data-numeric="" inputMode="numeric" value={limit} onChange={(e) => setLimit(e.currentTarget.value)} style={{ width: "12rem" }} />
                <Affix>円</Affix>
              </Group>
            </Field.Root>

            <Actions>
              <Button variant="ghost" onClick={close}>キャンセル</Button>
              <Button type="submit">追加する</Button>
            </Actions>
          </VStack>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
