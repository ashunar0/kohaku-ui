import type { ComponentPropsWithoutRef } from "react"

export type TimelineState = "done" | "current" | "rejected" | "waiting"

export type TimelineProps = ComponentPropsWithoutRef<"ol">
export type TimelineItemProps = ComponentPropsWithoutRef<"li"> & {
  /** 完了 / いま / 差し戻し / まだ。丸の形と色が変わる。既定は waiting */
  state?: TimelineState
}

/**
 * 決まった順番で進む段階と、いまどこまで進んだか（承認経路など）。表示するだけで操作は無い。
 * 丸は読み上げないので、状態の文字（「完了」など）は中身に書く。
 *
 *   <Timeline>
 *     <Timeline.Item state="done">申請</Timeline.Item>
 *     <Timeline.Item state="current">部署承認</Timeline.Item>
 *   </Timeline>
 */
export function Timeline(props: TimelineProps) {
  return <ol data-kh="timeline" {...props} />
}

function Item({ state = "waiting", children, ...props }: TimelineItemProps) {
  return (
    <li data-kh="timeline-item" data-state={state} aria-current={state === "current" ? "step" : undefined} {...props}>
      <span data-part="indicator" aria-hidden="true" />
      <div data-part="body">{children}</div>
    </li>
  )
}
Timeline.Item = Item
