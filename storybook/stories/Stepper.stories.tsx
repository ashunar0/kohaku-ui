import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { Actions, Button, Stepper } from "@kohaku/react"

/**
 * 入力を段階に分けて進める画面の、段階の表示と中身（Ark の Steps）。取り込み・初期設定など。
 *
 * 形は freee Vibes の Stepper: 番号の丸の下に段階名、丸どうしを線でつなぐ。段階は同じ幅に割る。
 * 済んだ段階は ✓、いまの段階は番号を塗る。色は accent だけ（状態ではなく「どこまで進めたか」なので）。
 * 既定で linear（番号を押しても飛べない）。進む・戻るは画面のボタンで `step` を変える。
 *
 * 表示するだけの経路（承認経路など）は Steps を使う。
 */
const meta = {
  title: "Base/Stepper",
  component: Stepper,
  args: { steps: ["ファイル選択", "内容確認", "完了"] },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

const steps = ["ファイル選択", "内容確認", "完了"]

/** 「次へ」「戻る」で進める */
export const Default: Story = {
  render: () => {
    const [step, setStep] = useState(0)
    return (
      <Stepper steps={steps} step={step} style={{ maxWidth: "36rem" }}>
        {steps.map((name, i) => (
          <Stepper.Content key={name} index={i} style={{ paddingTop: "2rem" }}>
            <p>{name}の中身</p>
            <Actions align="start">
              {i > 0 ? <Button variant="outline" onClick={() => setStep(i - 1)}>戻る</Button> : null}
              {i < steps.length - 1 ? <Button onClick={() => setStep(i + 1)}>次へ</Button> : null}
            </Actions>
          </Stepper.Content>
        ))}
      </Stepper>
    )
  },
}

/** 段階ごとの見た目。1 段目・2 段目・最後 */
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem", maxWidth: "36rem" }}>
      {[0, 1, 2].map((s) => <Stepper key={s} steps={steps} step={s} />)}
    </div>
  ),
}
