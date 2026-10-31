import { Progress as Ark } from "@ark-ui/react"
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react"

export type ProgressProps = ComponentPropsWithoutRef<typeof Ark.Root> & {
  /** 何の進み具合か。省略するときは aria-label を付ける */
  label?: ReactNode
  /** 右上に「40%」のような値を出す */
  showValue?: boolean
}

/**
 * Track / Range を隠す。value を渡さないと「終わりが分からない読み込み中」になる。
 *
 * Ark は role="progressbar" を Track に付け、名前を値の文字列（"40%"）にする。
 * それだと「何の」進み具合か読み上げられないので、Track を Label に結び付ける。
 * label が無いときは、Root に渡された aria-label を Track に移す。
 */
export function Progress({ label, showValue, children, "aria-label": ariaLabel, ids, ...props }: ProgressProps) {
  const labelId = useId()
  return (
    <Ark.Root ids={{ label: labelId, ...ids }} {...props}>
      {label != null ? <Ark.Label>{label}</Ark.Label> : null}
      {showValue ? <Ark.ValueText /> : null}
      <Ark.Track
        aria-labelledby={label != null ? (ids?.label ?? labelId) : undefined}
        aria-label={label == null ? ariaLabel : undefined}
      >
        <Ark.Range />
      </Ark.Track>
      {children}
    </Ark.Root>
  )
}

/** 素の構造で組みたいとき用 */
Progress.Root = Ark.Root
Progress.Label = Ark.Label
Progress.ValueText = Ark.ValueText
Progress.Track = Ark.Track
Progress.Range = Ark.Range
Progress.Context = Ark.Context
