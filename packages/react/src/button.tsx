import { Children, cloneElement, isValidElement, type ComponentPropsWithoutRef, type ReactElement } from "react"
import { Spinner } from "./spinner"
import type { Size } from "./types"

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "solid" | "outline" | "ghost" | "danger"
  size?: Size
  /** 処理中。文字をくるくるに入れ替える（幅はそのまま）。押しても何も起きない */
  loading?: boolean
  /** 処理中に読み上げる文言。既定は「処理中」 */
  loadingLabel?: string
  /**
   * children の要素に見た目だけ渡す。画面を移る操作（<a>・ルーターの Link）をボタンの形で出すとき。
   *   <Button asChild><a href="/new">新しい申請</a></Button>
   * type と loading は渡さない（リンクには無い）
   */
  asChild?: boolean
}

export function Button({ variant, size, type = "button", loading, loadingLabel = "処理中", onClick, asChild, children, ...props }: ButtonProps) {
  if (asChild) {
    const child = Children.only(children)
    if (!isValidElement(child)) return null
    /* 利用側が child に直接書いた属性を勝たせる（Link の asChild と同じ） */
    return cloneElement(child as ReactElement<Record<string, unknown>>, {
      "data-kh": "button",
      "data-variant": variant,
      "data-size": size,
      onClick,
      ...props,
      ...(child.props as Record<string, unknown>),
    })
  }
  return (
    <button
      data-kh="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "" : undefined}
      type={type}
      {...props}
      // disabled にするとフォーカスが外れるので、押せないことは aria-disabled で伝え、
      // クリック（Enter・Space も含む）と送信を打ち消す
      aria-disabled={loading ? true : props["aria-disabled"]}
      onClick={loading ? (e) => e.preventDefault() : onClick}
    >
      {children}
      {loading ? <Spinner label={loadingLabel} /> : null}
    </button>
  )
}

/**
 * アイコンだけのボタン。正方形になる。
 *
 * `label` は必須。アイコンしか無いので、名前が無いと読み上げで「ボタン」になる。
 * 書くのは「操作の名前」で、絵柄の名前ではない（虫眼鏡なら「拡大」ではなく「探す」）。
 * 見た目は Button と同じ CSS（`data-icon` が付くだけ）なので variant / size / loading はそのまま使える。
 */
export type IconButtonProps = Omit<ButtonProps, "aria-label"> & {
  label: string
  /** 右上に点を出す（未読があるときなど）。点は読み上げないので、label にも状態を書く */
  indicator?: boolean
}

export function IconButton({ label, indicator, ...props }: IconButtonProps) {
  return <Button data-icon="" data-indicator={indicator ? "" : undefined} aria-label={label} {...props} />
}
