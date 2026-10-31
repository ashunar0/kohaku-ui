<script setup lang="ts">
/** label を props（か label slot）で受けて、位置を間違えられないようにする */
import { RadioGroup } from "@ark-ui/vue"

defineProps<{ label?: string }>()
</script>

<template>
  <RadioGroup.Root>
    <RadioGroup.Label v-if="label || $slots.label"><slot name="label">{{ label }}</slot></RadioGroup.Label>
    <slot />
  </RadioGroup.Root>
</template>
