import type { Decorator, Preview } from "@storybook/react-vite"
import { useEffect } from "react"
import "@kohaku/styles"

/**
 * テーマは <html data-theme> で切り替わる。kohaku の L2 トークンだけが差し替わり、
 * コンポーネント側の CSS は 1 行も分岐しない。
 * 地の色はページ側の責任なので、ここで canvas を当てる（kohaku は body に触らない）。
 */
const withTheme: Decorator = (Story, ctx) => {
  const theme = ctx.globals.theme as "light" | "dark"
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    document.body.style.background = "var(--kh-color-canvas)"
    document.body.style.color = "var(--kh-color-fg-body)"
  }, [theme])
  return <Story />
}

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: { theme: "light" },
  globalTypes: {
    theme: {
      description: "kohaku のテーマ",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    // kohaku 自身が地の色を持つので、Storybook 側の背景切り替えは使わない
    backgrounds: { disable: true },
  },
}

export default preview
