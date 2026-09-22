import type { ComponentPropsWithoutRef, ReactNode } from "react"

type Div = ComponentPropsWithoutRef<"div">

export type AlertVariant = "neutral" | "danger" | "warning" | "success" | "info"

export type AlertProps = Div & {
  variant?: AlertVariant
  /** 地を塗る。主張が強いので 1 画面に 1 枚まで */
  tone?: "soft"
  icon?: ReactNode
  title?: ReactNode
  children?: ReactNode
}

/**
 * icon / title / children を渡す簡易形。
 * 細かく組みたいときは Alert.Root と part を直接使う。
 */
export function Alert({ variant, tone, icon, title, children, ...props }: AlertProps) {
  // variant に既定のグリフがあるので、icon を渡さなくても空の箱を置く。
  // 中身が空なら CSS が variant ごとの絵柄を描く。neutral だけ絵柄を持たない。
  const hasGlyph = variant !== undefined && variant !== "neutral"
  return (
    <div data-kh="alert" data-variant={variant} data-tone={tone} {...props}>
      {icon ? <span data-part="icon">{icon}</span> : hasGlyph ? <span data-part="icon" /> : null}
      {title ? <p data-part="title">{title}</p> : null}
      {children ? <p data-part="description">{children}</p> : null}
    </div>
  )
}

Alert.Root = function AlertRoot({ variant, tone, ...props }: Div & { variant?: AlertVariant; tone?: "soft" }) {
  return <div data-kh="alert" data-variant={variant} data-tone={tone} {...props} />
}
Alert.Icon = (props: ComponentPropsWithoutRef<"span">) => <span data-part="icon" {...props} />
Alert.Title = (props: ComponentPropsWithoutRef<"p">) => <p data-part="title" {...props} />
Alert.Description = (props: ComponentPropsWithoutRef<"p">) => <p data-part="description" {...props} />
Alert.Actions = (props: Div) => <div data-part="actions" {...props} />
