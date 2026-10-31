<script setup lang="ts">
/** コントロールを横に並べる。サイズの一括指定と連結を担う */
import type { FieldSize } from "./types"

defineProps<{
  size?: FieldSize
  /** 隙間なく連結する（検索欄 + 実行ボタンなど） */
  attached?: boolean
}>()
</script>

<template>
  <div data-kh="group" :data-size="size" :data-attached="attached ? '' : undefined"><slot /></div>
</template>
