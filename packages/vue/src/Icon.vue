<script lang="ts">
/**
 * Lucide 等の SVG に kohaku のサイズ規約を与える。
 * 期待する幾何: viewBox 0 0 24 24 / stroke-width 2 / round / currentColor
 *
 * 使い方は 2 つ（@kohaku/react と同じ）。
 *
 * 1. パスを slot に書く（kohaku が <svg> を出す）
 *      <Icon><path d="…" /></Icon>
 *
 * 2. `asChild` で、既に <svg> を出すコンポーネントをそのまま通す
 *      <Icon as-child><Search /></Icon>
 *
 * asChild で vnode を複製するため、template ではなく render 関数で書いている。
 */
import { firstElement } from "./as-child"
import { cloneVNode, defineComponent, h, type PropType, type VNode } from "vue"

export default defineComponent({
  name: "KhIcon",
  props: {
    size: { type: String as PropType<"sm" | "md" | "lg" | "xl">, default: undefined },
    /** slot の <svg> に data-* を付けるだけにする。kohaku は <svg> を出さない */
    asChild: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () => {
      const nodes: VNode[] = slots.default?.() ?? []

      if (props.asChild) {
        const child = firstElement(nodes)
        if (!child) return null
        return cloneVNode(child, {
          "data-kh": "icon",
          "data-size": props.size,
          "aria-hidden": "true",
        })
      }

      return h(
        "svg",
        {
          "data-kh": "icon",
          "data-size": props.size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "aria-hidden": "true",
        },
        nodes,
      )
    }
  },
})
</script>
