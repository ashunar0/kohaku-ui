<script setup lang="ts">
defineProps<{
  variant?: "neutral" | "outline" | "accent" | "danger" | "warning" | "success" | "info"
}>()
</script>

<template>
  <span data-kh="badge" :data-variant="variant"><slot /></span>
</template>
