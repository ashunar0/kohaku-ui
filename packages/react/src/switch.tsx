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
 * つながらない（zag の switch がつなぎに行かない）ので、description はここでつなぐ。
 *
 * 読み上げのために 2 つ足す:
 * - Ark の入力は type="checkbox" のままで「チェックボックス」と読まれる。role="switch" を付ける
 * - ラベルを出さない（表の中など）ときは aria-label を、画面に出さないラベルにする。
 *   Ark は入力を Label の id に aria-labelledby で結ぶので、Label が無いと名前の無い入力になる
 *   （aria-label は Root の <label> に付くだけで、入力には届かない）。
 *   ラベルは aria-hidden にして、入力の名前としてだけ読ませる（文字としても読むと 2 回になる）
 */
export function Switch({ children, description, "aria-label": ariaLabel, ...props }: SwitchProps) {
  const id = useId()
  const descId = description != null ? `${id}-description` : undefined
  return (
    <Ark.Root {...props}>
      <Ark.Control>
        <Ark.Thumb />
      </Ark.Control>
      {children != null ? (
        <Ark.Label>{children}</Ark.Label>
      ) : ariaLabel != null ? (
        <Ark.Label data-kh="visually-hidden" aria-hidden="true">{ariaLabel}</Ark.Label>
      ) : null}
      {description != null ? (
        <span data-scope="switch" data-part="description" id={descId}>{description}</span>
      ) : null}
      <Ark.HiddenInput role="switch" aria-describedby={descId} />
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
