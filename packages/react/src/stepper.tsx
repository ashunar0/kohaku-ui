import { Steps as Ark } from "@ark-ui/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

export type StepperProps = Omit<ComponentPropsWithoutRef<typeof Ark.Root>, "count"> & {
  /** 段階の名前。数がそのまま段階の数になる */
  steps: ReactNode[]
}

/**
 * 入力を段階に分けて進める画面の、段階の表示と中身（Ark の Steps）。List / Item / Trigger /
 * Indicator / Separator を steps から組み立てて隠す。中身は Stepper.Content を index ごとに置く。
 *
 * 既定で linear（番号を押しても飛べない）。進む・戻るは画面のボタンで step を変える。
 * 表示するだけの経路（承認経路など）は Steps を使う。
 *
 *   <Stepper steps={["ファイル選択", "内容確認", "完了"]} step={step}>
 *     <Stepper.Content index={0}>…</Stepper.Content>
 *   </Stepper>
 */
export function Stepper({ steps, linear = true, children, ...props }: StepperProps) {
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

Stepper.Content = Ark.Content
/** 素の構造で組みたいとき用 */
Stepper.Root = Ark.Root
Stepper.List = Ark.List
Stepper.Item = Ark.Item
Stepper.Trigger = Ark.Trigger
Stepper.Indicator = Ark.Indicator
Stepper.Separator = Ark.Separator
Stepper.CompletedContent = Ark.CompletedContent
Stepper.NextTrigger = Ark.NextTrigger
Stepper.PrevTrigger = Ark.PrevTrigger
Stepper.Context = Ark.Context
