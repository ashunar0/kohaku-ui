import type { ComponentPropsWithoutRef } from "react"
import type { FieldSize } from "./types"

/**
 * Field の外で使う複数行の入力欄。
 * Field.Root の中では Ark の <Field.Textarea> を使うこと。
 */
/* size は Input と同じ理由で先に落とす（textarea に size 属性は無いが揃えておく） */
export type TextareaProps = Omit<ComponentPropsWithoutRef<"textarea">, "size"> & { size?: FieldSize }
export function Textarea({ size, ...props }: TextareaProps) {
  return <textarea data-kh="textarea" data-size={size} {...props} />
}
