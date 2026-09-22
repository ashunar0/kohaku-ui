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
}

function Content({ children, withoutBackdrop, ...props }: DialogContentProps) {
  return (
    <Portal>
      {withoutBackdrop ? null : <Ark.Backdrop />}
      <Ark.Positioner>
        <Ark.Content {...props}>{children}</Ark.Content>
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
