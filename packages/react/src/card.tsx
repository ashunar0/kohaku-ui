import type { ComponentPropsWithoutRef } from "react"

type Div = ComponentPropsWithoutRef<"div">

export type CardRootProps = Div & {
  /** 地から浮かせる。並べて置くカードは flat のままにする */
  elevated?: boolean
  /** header / footer の境界に線を引く。既定は余白だけで区切る */
  divided?: boolean
}

function Root({ elevated, divided, ...props }: CardRootProps) {
  return (
    <div
      data-kh="card"
      data-elevated={elevated ? "" : undefined}
      data-divided={divided ? "" : undefined}
      {...props}
    />
  )
}

const part = (name: string, tag: "div" | "h3" | "p" = "div") =>
  function Part(props: Div) {
    const Tag = tag as "div"
    return <Tag data-part={name} {...props} />
  }

export const Card = {
  Root,
  Header: part("header"),
  Body: part("body"),
  Footer: part("footer"),
  Title: part("title", "h3"),
  Description: part("description", "p"),
}
