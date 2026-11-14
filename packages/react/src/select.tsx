import { Select as Ark, Portal } from "@ark-ui/react"
import type { ComponentPropsWithoutRef } from "react"
import type { FieldSize } from "./types"

export type SelectTriggerProps = ComponentPropsWithoutRef<typeof Ark.Trigger> & {
  /** Input の size と同じ高さ。表の中は sm */
  size?: FieldSize
}
export type SelectContentProps = ComponentPropsWithoutRef<typeof Ark.Content>

/** Control を内側に隠す */
function Trigger({ size, children, ...props }: SelectTriggerProps) {
  return (
    <Ark.Control>
      <Ark.Trigger data-size={size} {...props}>{children}</Ark.Trigger>
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
