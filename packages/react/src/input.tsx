import type { ComponentPropsWithoutRef, ReactNode } from "react"
import type { FieldSize } from "./types"

/**
 * Field の外で使う素の入力欄。
 * Field.Root の中では Ark の <Field.Input> を使うこと
 * （label との紐付けや invalid の伝播は Ark がやる）。
 *
 * icon を渡すと枠の内側の左に置く（検索の虫眼鏡など）。飾りなので読み上げには出さない。
 * 属性は <input> に流す。
 */
/* HTML の input には size 属性（表示幅・数値）がある。そのまま交差させると
   number & FieldSize = never になって size を渡せなくなるので、先に落とす。 */
export type InputProps = Omit<ComponentPropsWithoutRef<"input">, "size"> & {
  size?: FieldSize
  icon?: ReactNode
}
export function Input({ size, icon, ...props }: InputProps) {
  const input = <input data-kh="input" data-size={size} {...props} />
  if (!icon) return input
  return (
    <span data-kh="input-icon" data-size={size}>
      <span data-part="icon" aria-hidden="true">{icon}</span>
      {input}
    </span>
  )
}
