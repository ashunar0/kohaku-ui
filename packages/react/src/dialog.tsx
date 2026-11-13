import { Dialog as Ark, Portal } from "@ark-ui/react"
import type { ComponentPropsWithoutRef } from "react"

/**
 * Ark の Dialog に kohaku の組み立て規約を被せる。
 * Portal / Backdrop / Positioner は Content の内側に隠す。
 * 素の構造で組みたいときは @ark-ui/react を直接使う。
 */
export type DialogContentProps = ComponentPropsWithoutRef<typeof Ark.Content> & {
  /** backdrop を出さない（非モーダルな表示など） */
  withoutBackdrop?: boolean
  /** 右上の × を出さない（どちらかを必ず選ばせたいときなど） */
  withoutCloseTrigger?: boolean
  /** × の読み上げの名前。既定は「閉じる」 */
  closeLabel?: string
}

/* × は先頭に置く。見出しより前なので、Tab の順でも最初に来る（Esc と同じ逃げ道を先に渡す）。
   見た目の位置は CSS が右上に決める */
function Content({ children, withoutBackdrop, withoutCloseTrigger, closeLabel = "閉じる", ...props }: DialogContentProps) {
  return (
    <Portal>
      {withoutBackdrop ? null : <Ark.Backdrop />}
      <Ark.Positioner>
        <Ark.Content {...props}>
          {withoutCloseTrigger ? null : <Ark.CloseTrigger aria-label={closeLabel} />}
          {children}
        </Ark.Content>
      </Ark.Positioner>
    </Portal>
  )
}

export const Dialog = {
  ...Ark,
  Content,
  /** 隠さずに組みたい人向けに素の部品も残しておく */
  Backdrop: Ark.Backdrop,
  Positioner: Ark.Positioner,
  RawContent: Ark.Content,
}
