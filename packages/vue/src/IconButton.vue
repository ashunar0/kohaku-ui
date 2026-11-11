<script setup lang="ts">
/**
 * アイコンだけのボタン。正方形になる。
 *
 * `label` は必須。アイコンしか無いので、名前が無いと読み上げで「ボタン」になる。
 * 書くのは「操作の名前」で、絵柄の名前ではない（虫眼鏡なら「拡大」ではなく「探す」）。
 */
import type { Size } from "./types"

withDefaults(defineProps<{
  label: string
  variant?: "solid" | "outline" | "ghost" | "danger"
  size?: Size
  type?: "button" | "submit" | "reset"
}>(), { type: "button" })
</script>

<template>
  <button data-kh="button" data-icon="" :aria-label="label" :data-variant="variant" :data-size="size" :type="type">
    <slot />
  </button>
</template>
