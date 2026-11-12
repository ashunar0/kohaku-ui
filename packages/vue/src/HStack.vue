<script setup lang="ts">
/** 横に並べる。間隔の既定は 2（8px）、縦は中央揃え、幅が足りなければ折り返す（@kohaku/react と同じ） */
import type { Space } from "./types"

const props = withDefaults(defineProps<{
  gap?: Space
  align?: "start" | "center" | "end" | "stretch" | "baseline"
  justify?: "start" | "center" | "end" | "between"
  /** false で折り返さない */
  wrap?: boolean
}>(), { wrap: true })
</script>

<template>
  <div
    data-kh="hstack"
    :data-gap="props.gap"
    :data-align="props.align"
    :data-justify="props.justify"
    :data-nowrap="props.wrap === false ? '' : undefined"
  ><slot /></div>
</template>
