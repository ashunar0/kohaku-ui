<script setup lang="ts">
import { computed, useAttrs } from "vue"
import Spinner from "./Spinner.vue"
import type { Size } from "./types"

/** 処理中の扱いは @kohaku/react の Button と同じ。attrs は自分で渡す（click を打ち消すため） */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  variant?: "solid" | "outline" | "ghost" | "danger"
  size?: Size
  type?: "button" | "submit" | "reset"
  /** 処理中。文字をくるくるに入れ替える（幅はそのまま）。押しても何も起きない */
  loading?: boolean
  /** 処理中に読み上げる文言 */
  loadingLabel?: string
}>(), { type: "button", loading: false, loadingLabel: "処理中" })

const attrs = useAttrs()
// disabled にするとフォーカスが外れるので、押せないことは aria-disabled で伝え、
// クリック（Enter・Space も含む）と送信を打ち消す
const bound = computed(() =>
  props.loading ? { ...attrs, "aria-disabled": "true", onClick: (e: Event) => e.preventDefault() } : attrs,
)
</script>

<template>
  <button
    v-bind="bound"
    data-kh="button"
    :data-variant="variant"
    :data-size="size"
    :data-loading="loading ? '' : undefined"
    :type="type"
  ><slot /><Spinner v-if="loading" :label="loadingLabel" /></button>
</template>
