import { Avatar as Ark } from "@ark-ui/react"
import type { ComponentPropsWithoutRef } from "react"

export type AvatarProps = ComponentPropsWithoutRef<typeof Ark.Root> & {
  /** 利用者の名前。画像が無い・読み込めないときは 1 文字目を出す。画像の代わりの文字（alt）にもなる */
  name: string
  /** 画像の URL */
  src?: string
}

/**
 * 利用者のアイコン。Image / Fallback の組み立てを隠す。
 *
 * 名前の文字と並べて置くのがふつうなので、既定では読み上げない（aria-hidden）。
 * 名前が隣に無いところに単独で置くときは、aria-hidden={false} にして aria-label で名前を付ける。
 */
export function Avatar({ name, src, ...props }: AvatarProps) {
  return (
    <Ark.Root aria-hidden {...props}>
      <Ark.Fallback>{Array.from(name.trim())[0]}</Ark.Fallback>
      {src ? <Ark.Image src={src} alt={name} /> : null}
    </Ark.Root>
  )
}

/** 素の構造で組みたいとき用 */
Avatar.Root = Ark.Root
Avatar.Image = Ark.Image
Avatar.Fallback = Ark.Fallback
Avatar.Context = Ark.Context
