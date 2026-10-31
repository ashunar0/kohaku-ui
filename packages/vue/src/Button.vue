<script setup lang="ts">
import type { Size } from "./types"

withDefaults(defineProps<{
  variant?: "solid" | "outline" | "ghost" | "danger"
  size?: Size
  type?: "button" | "submit" | "reset"
}>(), { type: "button" })
</script>

<template>
  <button data-kh="button" :data-variant="variant" :data-size="size" :type="type"><slot /></button>
</template>
