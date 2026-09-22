import { Select as Ark, Portal } from "@ark-ui/react"
import type { ComponentPropsWithoutRef } from "react"

export type SelectTriggerProps = ComponentPropsWithoutRef<typeof Ark.Trigger>
export type SelectContentProps = ComponentPropsWithoutRef<typeof Ark.Content>

/** Control を内側に隠す */
function Trigger({ children, ...props }: SelectTriggerProps) {
  return (
    <Ark.Control>
      <Ark.Trigger {...props}>{children}</Ark.Trigger>
    </Ark.Control>
  )
}

/** Portal / Positioner を内側に隠す */
function Content({ children, ...props }: SelectContentProps) {
  return (
    <Portal>
      <Ark.Positioner>
        <Ark.Content {...props}>{children}</Ark.Content>
      </Ark.Positioner>
    </Portal>
  )
}

export const Select = {
  ...Ark,
  Trigger,
  Content,
  Control: Ark.Control,
  Positioner: Ark.Positioner,
  RawTrigger: Ark.Trigger,
  RawContent: Ark.Content,
}
