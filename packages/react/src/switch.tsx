import { Switch as Ark } from "@ark-ui/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

export type SwitchProps = ComponentPropsWithoutRef<typeof Ark.Root> & {
  children?: ReactNode
}

/** Control / Thumb / HiddenInput を隠す。children がラベルになる */
export function Switch({ children, ...props }: SwitchProps) {
  return (
    <Ark.Root {...props}>
      <Ark.Control>
        <Ark.Thumb />
      </Ark.Control>
      {children != null ? <Ark.Label>{children}</Ark.Label> : null}
      <Ark.HiddenInput />
    </Ark.Root>
  )
}

/** 素の構造で組みたいとき用 */
Switch.Root = Ark.Root
Switch.Control = Ark.Control
Switch.Thumb = Ark.Thumb
Switch.Label = Ark.Label
Switch.HiddenInput = Ark.HiddenInput
Switch.Context = Ark.Context
