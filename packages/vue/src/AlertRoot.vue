<script setup lang="ts">
import type { AlertVariant } from "./alert-types"

defineProps<{ variant?: AlertVariant; tone?: "soft" }>()
</script>

<template>
  <div data-kh="alert" :data-variant="variant" :data-tone="tone"><slot /></div>
</template>
