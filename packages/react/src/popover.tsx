import { Popover as Ark, Portal } from "@ark-ui/react"
import type { ComponentPropsWithoutRef } from "react"

export type PopoverContentProps = ComponentPropsWithoutRef<typeof Ark.Content>

/** Portal / Positioner を内側に隠す */
function Content({ children, ...props }: PopoverContentProps) {
  return (
    <Portal>
      <Ark.Positioner>
        <Ark.Content {...props}>{children}</Ark.Content>
      </Ark.Positioner>
    </Portal>
  )
}

export const Popover = {
  ...Ark,
  Content,
  Positioner: Ark.Positioner,
  RawContent: Ark.Content,
}
