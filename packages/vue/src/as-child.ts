import { Fragment, type VNode } from "vue"

/**
 * asChild で見た目を渡す相手（slot の最初の要素）を探す。
 * slot を中継すると（IconButton → Button）中身が Fragment に包まれて届くので、ほどいてから探す。
 * テキストやコメント（v-if の跡）は飛ばす。
 */
export function firstElement(nodes: VNode[]): VNode | undefined {
  for (const n of nodes) {
    if (n.type === Fragment && Array.isArray(n.children)) {
      const inner = firstElement(n.children as VNode[])
      if (inner) return inner
    } else if (typeof n.type !== "symbol") {
      return n
    }
  }
  return undefined
}
