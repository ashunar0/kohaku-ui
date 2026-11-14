import { Steps as Ark } from "@ark-ui/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

export type StepsProps = Omit<ComponentPropsWithoutRef<typeof Ark.Root>, "count"> & {
  /** 段階の名前。数がそのまま段階の数になる */
  steps: ReactNode[]
}

/**
 * 入力を段階に分けて進める画面の、段階の表示と中身（Ark の Steps）。List / Item / Trigger /
 * Indicator / Separator を steps から組み立てて隠す。中身は Steps.Content を index ごとに置く。
 *
 * 既定で linear（番号を押しても飛べない）。進む・戻るは画面のボタンで step を変える。
 * 表示するだけの経路（承認経路など）は Timeline を使う。
 *
 *   <Steps steps={["ファイル選択", "内容確認", "完了"]} step={step}>
 *     <Steps.Content index={0}>…</Steps.Content>
 *   </Steps>
 */
export function Steps({ steps, linear = true, children, ...props }: StepsProps) {
  return (
    <Ark.Root count={steps.length} linear={linear} {...props}>
      <Ark.List>
        {steps.map((name, i) => (
          <Ark.Item key={i} index={i}>
            <Ark.Trigger>
              <Ark.Indicator>{i + 1}</Ark.Indicator>
              <span>{name}</span>
            </Ark.Trigger>
            {i < steps.length - 1 ? <Ark.Separator /> : null}
          </Ark.Item>
        ))}
      </Ark.List>
      {children}
    </Ark.Root>
  )
}

Steps.Content = Ark.Content
/** 素の構造で組みたいとき用 */
Steps.Root = Ark.Root
Steps.List = Ark.List
Steps.Item = Ark.Item
Steps.Trigger = Ark.Trigger
Steps.Indicator = Ark.Indicator
Steps.Separator = Ark.Separator
Steps.CompletedContent = Ark.CompletedContent
Steps.NextTrigger = Ark.NextTrigger
Steps.PrevTrigger = Ark.PrevTrigger
Steps.Context = Ark.Context
