import { Switch as Ark } from "@ark-ui/react"
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react"

export type SwitchProps = ComponentPropsWithoutRef<typeof Ark.Root> & {
  children?: ReactNode
  /** ラベルの下に出す補足。読み上げではラベルとは別に、補足として読まれる */
  description?: ReactNode
}

/**
 * Control / Thumb / HiddenInput を隠す。children がラベルになる。
 * Ark の Switch には補足の部品が無く、Field.HelperText を置いても aria-describedby が
 * つながらない（zag の switch がつなぎに行かない）ので、description はここでつなぐ
 */
export function Switch({ children, description, ...props }: SwitchProps) {
  const id = useId()
  const descId = description != null ? `${id}-description` : undefined
  return (
    <Ark.Root {...props}>
      <Ark.Control>
        <Ark.Thumb />
      </Ark.Control>
      {children != null ? <Ark.Label>{children}</Ark.Label> : null}
      {description != null ? (
        <span data-scope="switch" data-part="description" id={descId}>{description}</span>
      ) : null}
      <Ark.HiddenInput aria-describedby={descId} />
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
