<script setup lang="ts">
/**
 * アイコンだけのボタン。正方形になる。
 *
 * `label` は必須。アイコンしか無いので、名前が無いと読み上げで「ボタン」になる。
 * 書くのは「操作の名前」で、絵柄の名前ではない（虫眼鏡なら「拡大」ではなく「探す」）。
 * 中身は Button なので variant / size / loading はそのまま使える。
 */
import Button from "./Button.vue"
import type { Size } from "./types"

defineProps<{
  label: string
  variant?: "solid" | "outline" | "ghost" | "danger"
  size?: Size
  type?: "button" | "submit" | "reset"
  loading?: boolean
  loadingLabel?: string
  /** slot の要素に見た目だけ渡す（Button と同じ） */
  asChild?: boolean
}>()
</script>

<template>
  <Button
    data-icon=""
    :aria-label="label"
    :variant="variant"
    :size="size"
    :type="type ?? 'button'"
    :loading="loading"
    :loading-label="loadingLabel ?? '処理中'"
    :as-child="asChild"
  ><slot /></Button>
</template>
