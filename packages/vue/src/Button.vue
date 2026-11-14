<script lang="ts">
/**
 * 処理中の扱いと asChild は @kohaku/react の Button と同じ。
 * attrs は自分で渡す（click を打ち消すため。自動のフォールスルーと重なると @click が 2 回走る）。
 *
 * `as-child` で、slot の要素に見た目だけ渡す。画面を移る操作（<a>・RouterLink）をボタンの形で出すとき
 *   <Button as-child><a href="/new">新しい申請</a></Button>
 * type と loading は渡さない（リンクには無い）。
 *
 * asChild で vnode を複製するため、template ではなく render 関数で書いている（Link と同じ）。
 */
import { firstElement } from "./as-child"
import { cloneVNode, defineComponent, h, type PropType, type VNode } from "vue"
import Spinner from "./Spinner.vue"
import type { Size } from "./types"

export default defineComponent({
  name: "KhButton",
  inheritAttrs: false,
  props: {
    variant: String as PropType<"solid" | "outline" | "ghost" | "danger">,
    size: String as PropType<Size>,
    type: { type: String as PropType<"button" | "submit" | "reset">, default: "button" },
    /** 処理中。文字をくるくるに入れ替える（幅はそのまま）。押しても何も起きない */
    loading: { type: Boolean, default: false },
    /** 処理中に読み上げる文言 */
    loadingLabel: { type: String, default: "処理中" },
    /** slot の要素に見た目だけ渡す。kohaku は <button> を出さない */
    asChild: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const nodes: VNode[] = slots.default?.() ?? []
      const look = { "data-kh": "button", "data-variant": props.variant, "data-size": props.size }
      if (props.asChild) {
        const child = firstElement(nodes)
        if (!child) return null
        return cloneVNode(child, { ...look, ...attrs })
      }
      // disabled にするとフォーカスが外れるので、押せないことは aria-disabled で伝え、
      // クリック（Enter・Space も含む）と送信を打ち消す
      const bound = props.loading
        ? { ...attrs, "aria-disabled": "true", onClick: (e: Event) => e.preventDefault() }
        : attrs
      return h(
        "button",
        { ...bound, ...look, "data-loading": props.loading ? "" : undefined, type: props.type },
        [...nodes, props.loading ? h(Spinner, { label: props.loadingLabel }) : null],
      )
    }
  },
})
</script>
