import { Menu as Ark, Portal } from "@ark-ui/react"
import type { ComponentPropsWithoutRef } from "react"

export type MenuContentProps = ComponentPropsWithoutRef<typeof Ark.Content>
export type MenuItemProps = ComponentPropsWithoutRef<typeof Ark.Item> & {
  /** 削除など危険な操作。文字が赤くなる */
  variant?: "danger"
}

/** Portal / Positioner を内側に隠す */
function Content({ children, ...props }: MenuContentProps) {
  return (
    <Portal>
      <Ark.Positioner>
        <Ark.Content {...props}>{children}</Ark.Content>
      </Ark.Positioner>
    </Portal>
  )
}

function Item({ variant, ...props }: MenuItemProps) {
  return <Ark.Item data-variant={variant} {...props} />
}

export const Menu = {
  ...Ark,
  Content,
  Item,
  Positioner: Ark.Positioner,
  RawContent: Ark.Content,
  RawItem: Ark.Item,
}
