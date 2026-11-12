<script setup lang="ts">
/** 縦に積む。間隔の既定は 4（16px）、横幅いっぱいに伸ばす（@kohaku/react と同じ） */
import type { Space } from "./types"

defineProps<{
  gap?: Space
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  justify?: "start" | "center" | "end" | "between"
}>()
</script>

<template>
  <div data-kh="vstack" :data-gap="gap" :data-align="align" :data-justify="justify"><slot /></div>
</template>
