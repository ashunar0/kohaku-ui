<script setup lang="ts">
/** 読み込み中を示す。role="status" で、label を読み上げる（@kohaku/react と同じ） */
withDefaults(defineProps<{ size?: "sm" | "md" | "lg"; label?: string }>(), { label: "読み込み中" })
</script>

<template>
  <span data-kh="spinner" :data-size="size" role="status">
    <svg viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="20" /></svg>
    <span data-kh="visually-hidden">{{ label }}</span>
  </span>
</template>
