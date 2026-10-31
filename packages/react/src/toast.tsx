import { Toast as Ark, Toaster as ArkToaster } from "@ark-ui/react"
import type { ComponentPropsWithoutRef } from "react"

export type ToasterProps = Omit<ComponentPropsWithoutRef<typeof ArkToaster>, "children"> & {
  /** 中身を自分で組みたいときだけ渡す。省略すると title / description / action / 閉じるボタンを並べる */
  children?: ComponentPropsWithoutRef<typeof ArkToaster>["children"]
}

/**
 * Ark の Toaster に中身の組み立てを入れたもの。アプリの根元に 1 つ置き、
 * `createToaster()` で作った toaster から `toaster.success({ title })` のように出す。
 *
 * Ark の既定の名前は英語（"Notifications, bottom-end (altKey+T)" / "Dismiss notification"）なので日本語にする。
 */
export function Toaster({ children, ...props }: ToasterProps) {
  return (
    <ArkToaster aria-label="通知" {...props}>
      {children ??
        ((t) => (
          <Ark.Root>
            {t.title != null ? <Ark.Title>{t.title}</Ark.Title> : null}
            {t.description != null ? <Ark.Description>{t.description}</Ark.Description> : null}
            {t.action ? <Ark.ActionTrigger>{t.action.label}</Ark.ActionTrigger> : null}
            {t.closable !== false ? <Ark.CloseTrigger aria-label="通知を閉じる" /> : null}
          </Ark.Root>
        ))}
    </ArkToaster>
  )
}

export const Toast = Ark
