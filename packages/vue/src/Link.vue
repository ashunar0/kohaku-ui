<script lang="ts">
/**
 * 常に下線のあるリンク。hover で色が濃くなる（@kohaku/react と同じ）。
 *
 * 1. そのまま使うと <a> を出す
 *      <Link href="/rules">経費精算の規程</Link>
 *
 * 2. `asChild` で、slot の要素に見た目だけ渡す。表の行を開く <button> や RouterLink はこちら
 *      <Link as-child><button type="button" @click="open">EX-1042</button></Link>
 *
 * asChild で vnode を複製するため、template ではなく render 関数で書いている（Icon と同じ）。
 */
import { firstElement } from "./as-child"
import { cloneVNode, defineComponent, h, type VNode } from "vue"

export default defineComponent({
  name: "KhLink",
  // attrs は自分で渡す。自動のフォールスルーと重なると @click が 2 回走る
  inheritAttrs: false,
  props: {
    /** slot の要素に data-kh を付けるだけにする。kohaku は <a> を出さない */
    asChild: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const nodes: VNode[] = slots.default?.() ?? []
      if (props.asChild) {
        const child = firstElement(nodes)
        if (!child) return null
        return cloneVNode(child, { "data-kh": "link", ...attrs })
      }
      return h("a", { "data-kh": "link", ...attrs }, nodes)
    }
  },
})
</script>
