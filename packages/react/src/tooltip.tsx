import { Tooltip as Ark, Portal } from "@ark-ui/react"
import type { ComponentPropsWithoutRef } from "react"

export type TooltipRootProps = ComponentPropsWithoutRef<typeof Ark.Root>
export type TooltipContentProps = ComponentPropsWithoutRef<typeof Ark.Content>

/**
 * interactive の既定を true にする。Ark の既定（false）だと Tooltip の上に
 * ポインタを移した瞬間に閉じ、WCAG 1.4.13（ホバーで出た内容の上に移れる）を満たさない
 */
function Root({ interactive = true, ...props }: TooltipRootProps) {
  return <Ark.Root interactive={interactive} {...props} />
}

/** Portal / Positioner を内側に隠す */
function Content({ children, ...props }: TooltipContentProps) {
  return (
    <Portal>
      <Ark.Positioner>
        <Ark.Content {...props}>{children}</Ark.Content>
      </Ark.Positioner>
    </Portal>
  )
}

export const Tooltip = {
  ...Ark,
  Root,
  Content,
  Positioner: Ark.Positioner,
  RawRoot: Ark.Root,
  RawContent: Ark.Content,
}
