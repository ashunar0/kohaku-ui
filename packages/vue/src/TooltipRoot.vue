<script setup lang="ts">
/**
 * interactive の既定を true にする。Ark の既定（false）だと Tooltip の上に
 * ポインタを移した瞬間に閉じ、WCAG 1.4.13（ホバーで出た内容の上に移れる）を満たさない
 */
import { Tooltip } from "@ark-ui/vue"

withDefaults(defineProps<{ interactive?: boolean }>(), { interactive: true })
</script>

<template>
  <Tooltip.Root :interactive="interactive"><slot /></Tooltip.Root>
</template>
