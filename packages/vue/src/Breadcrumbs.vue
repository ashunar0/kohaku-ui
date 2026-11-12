<script setup lang="ts">
/**
 * nav > ol を組み立てる。aria-label の既定は「現在の位置」（@kohaku/react と同じ）。
 * 区切りは CSS が描くので、中には Breadcrumbs.Item を並べるだけでよい。
 */
withDefaults(defineProps<{ ariaLabel?: string }>(), { ariaLabel: "現在の位置" })
</script>

<template>
  <nav data-kh="breadcrumbs" :aria-label="ariaLabel"><ol><slot /></ol></nav>
</template>
