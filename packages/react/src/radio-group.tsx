import { RadioGroup as Ark } from "@ark-ui/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

export type RadioGroupProps = ComponentPropsWithoutRef<typeof Ark.Root> & {
  /** グループ全体の見出し。省略すると label を出さない */
  label?: ReactNode
  children?: ReactNode
}
export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof Ark.Item> & {
  children?: ReactNode
}

/** label を props で受けて、位置を間違えられないようにする */
export function RadioGroup({ label, children, ...props }: RadioGroupProps) {
  return (
    <Ark.Root {...props}>
      {label != null ? <Ark.Label>{label}</Ark.Label> : null}
      {children}
    </Ark.Root>
  )
}

/**
 * ItemControl / ItemText / ItemHiddenInput を隠す。children がラベルになる。
 * 丸の中の点は CSS が ::after で描くので、Control に子は要らない。
 */
function Item({ children, ...props }: RadioGroupItemProps) {
  return (
    <Ark.Item {...props}>
      <Ark.ItemControl />
      {children != null ? <Ark.ItemText>{children}</Ark.ItemText> : null}
      <Ark.ItemHiddenInput />
    </Ark.Item>
  )
}

RadioGroup.Item = Item

/** 素の構造で組みたいとき用 */
RadioGroup.Root = Ark.Root
RadioGroup.Label = Ark.Label
RadioGroup.RawItem = Ark.Item
RadioGroup.ItemControl = Ark.ItemControl
RadioGroup.ItemText = Ark.ItemText
RadioGroup.ItemHiddenInput = Ark.ItemHiddenInput
RadioGroup.Indicator = Ark.Indicator
RadioGroup.Context = Ark.Context
RadioGroup.ItemContext = Ark.ItemContext
