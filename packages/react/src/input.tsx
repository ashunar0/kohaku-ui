import type { ComponentPropsWithoutRef, ReactNode } from "react"
import type { FieldSize } from "./types"

/**
 * Field の外で使う素の入力欄。
 * Field.Root の中では Ark の <Field.Input> を使うこと
 * （label との紐付けや invalid の伝播は Ark がやる）。
 *
 * icon を渡すと枠の内側の左に置く（検索の虫眼鏡など）。飾りなので読み上げには出さない。
 * numeric は数字だけが入る欄（金額・数量）。右寄せ・等幅数字・数字用の縦位置になり、
 * inputMode を指定しなければ numeric（数字キーボード）にする。
 * Field.Input には data-numeric を直接付ける。
 * 属性は <input> に流す。
 */
/* HTML の input には size 属性（表示幅・数値）がある。そのまま交差させると
   number & FieldSize = never になって size を渡せなくなるので、先に落とす。 */
export type InputProps = Omit<ComponentPropsWithoutRef<"input">, "size"> & {
  size?: FieldSize
  icon?: ReactNode
  numeric?: boolean
}
export function Input({ size, icon, numeric, ...props }: InputProps) {
  const input = (
    <input
      data-kh="input"
      data-size={size}
      data-numeric={numeric ? "" : undefined}
      inputMode={numeric ? "numeric" : undefined}
      {...props}
    />
  )
  if (!icon) return input
  return (
    <span data-kh="input-icon" data-size={size}>
      <span data-part="icon" aria-hidden="true">{icon}</span>
      {input}
    </span>
  )
}
