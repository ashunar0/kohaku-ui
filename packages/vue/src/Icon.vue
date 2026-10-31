<script setup lang="ts">
/**
 * Lucide 等の SVG に kohaku のサイズ規約を与える。
 * 期待する幾何: viewBox 0 0 24 24 / stroke-width 2 / round / currentColor
 */
defineProps<{ size?: "sm" | "md" | "lg" | "xl" }>()
</script>

<template>
  <svg
    data-kh="icon"
    :data-size="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  ><slot /></svg>
</template>
