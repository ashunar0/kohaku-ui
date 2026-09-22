import type { ComponentPropsWithoutRef } from "react"
import type { FieldSize } from "./types"

/**
 * Field の外で使う素の入力欄。
 * Field.Root の中では Ark の <Field.Input> を使うこと
 * （label との紐付けや invalid の伝播は Ark がやる）。
 */
/* HTML の input には size 属性（表示幅・数値）がある。そのまま交差させると
   number & FieldSize = never になって size を渡せなくなるので、先に落とす。 */
export type InputProps = Omit<ComponentPropsWithoutRef<"input">, "size"> & { size?: FieldSize }
export function Input({ size, ...props }: InputProps) {
  return <input data-kh="input" data-size={size} {...props} />
}

export type TextareaProps = Omit<ComponentPropsWithoutRef<"textarea">, "size"> & { size?: FieldSize }
export function Textarea({ size, ...props }: TextareaProps) {
  return <textarea data-kh="textarea" data-size={size} {...props} />
}
