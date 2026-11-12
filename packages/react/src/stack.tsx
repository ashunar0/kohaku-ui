import type { ComponentPropsWithoutRef } from "react"

/** kohaku の間隔トークンの番号。4 = --kh-space-4 = 16px（Tailwind の gap-4 と同じ） */
export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8

type StackProps = ComponentPropsWithoutRef<"div"> & {
  gap?: Space
  /** 交差軸の揃え（VStack なら横、HStack なら縦） */
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  /** 主軸の揃え */
  justify?: "start" | "center" | "end" | "between"
}

/** 縦に積む。間隔の既定は 4（16px）、横幅いっぱいに伸ばす */
export type VStackProps = StackProps
export function VStack({ gap, align, justify, ...props }: VStackProps) {
  return <div data-kh="vstack" data-gap={gap} data-align={align} data-justify={justify} {...props} />
}

/** 横に並べる。間隔の既定は 2（8px）、縦は中央揃え、幅が足りなければ折り返す */
export type HStackProps = StackProps & {
  /** false で折り返さない */
  wrap?: boolean
}
export function HStack({ gap, align, justify, wrap, ...props }: HStackProps) {
  return (
    <div
      data-kh="hstack"
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-nowrap={wrap === false ? "" : undefined}
      {...props}
    />
  )
}
