import { Checkbox as Ark } from "@ark-ui/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

export type CheckboxProps = ComponentPropsWithoutRef<typeof Ark.Root> & {
  /** チェックマークを差し替える。省略すると CSS が --kh-glyph-check を描く */
  indicator?: ReactNode
  /** indeterminate の絵柄を差し替える。省略すると --kh-glyph-minus */
  indeterminateIndicator?: ReactNode
  children?: ReactNode
}

/**
 * Control / Indicator / HiddenInput を隠す。children がラベルになる。
 *
 * Indicator は 2 つ要る。zag は checked でも indeterminate でも 1 つの
 * indicator を出すが、Ark の React 実装が
 * `isVisible = indeterminate ? ctx.indeterminate : ctx.checked` で上書きしており、
 * 素の Indicator は indeterminate のとき隠れる。
 * どちらも空なら CSS が data-state で絵柄を選ぶ。
 */
export function Checkbox({ indicator, indeterminateIndicator, children, ...props }: CheckboxProps) {
  return (
    <Ark.Root {...props}>
      <Ark.Control>
        <Ark.Indicator>{indicator}</Ark.Indicator>
        <Ark.Indicator indeterminate>{indeterminateIndicator}</Ark.Indicator>
      </Ark.Control>
      {children != null ? <Ark.Label>{children}</Ark.Label> : null}
      <Ark.HiddenInput />
    </Ark.Root>
  )
}

/** 素の構造で組みたいとき用。隠した部品をそのまま出す */
Checkbox.Root = Ark.Root
Checkbox.Control = Ark.Control
Checkbox.Indicator = Ark.Indicator
Checkbox.Label = Ark.Label
Checkbox.HiddenInput = Ark.HiddenInput
Checkbox.Group = Ark.Group
Checkbox.Context = Ark.Context
