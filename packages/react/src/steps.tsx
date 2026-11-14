import type { ComponentPropsWithoutRef } from "react"

export type StepState = "done" | "current" | "rejected" | "waiting"

export type StepsProps = ComponentPropsWithoutRef<"ol">
export type StepsItemProps = ComponentPropsWithoutRef<"li"> & {
  /** 完了 / いま / 差し戻し / まだ。丸の形と色が変わる。既定は waiting */
  state?: StepState
}

/**
 * 決まった順番で進む段階と、いまどこまで進んだか（承認経路など）。表示するだけで操作は無い。
 * 丸は読み上げないので、状態の文字（「完了」など）は中身に書く。
 *
 *   <Steps>
 *     <Steps.Item state="done">申請</Steps.Item>
 *     <Steps.Item state="current">部署承認</Steps.Item>
 *   </Steps>
 */
export function Steps(props: StepsProps) {
  return <ol data-kh="steps" {...props} />
}

function Item({ state = "waiting", children, ...props }: StepsItemProps) {
  return (
    <li data-kh="step" data-state={state} aria-current={state === "current" ? "step" : undefined} {...props}>
      <span data-part="indicator" aria-hidden="true" />
      <div data-part="body">{children}</div>
    </li>
  )
}
Steps.Item = Item
