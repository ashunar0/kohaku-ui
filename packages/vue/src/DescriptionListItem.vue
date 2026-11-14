<script setup lang="ts">
/** 1 項目。項目名は term か #term スロット、値は既定のスロット（@kohaku/react と同じ） */
defineProps<{
  /** 項目名 */
  term?: string
  /** 項目名のそろえ方。既定は値の 1 行目のベースライン。アイコンと名前を横に並べた 1 行の値は center */
  align?: "baseline" | "center"
}>()
</script>

<template>
  <div data-part="item" :data-align="align">
    <dt data-part="term"><slot name="term">{{ term }}</slot></dt>
    <dd data-part="details"><slot /></dd>
  </div>
</template>
