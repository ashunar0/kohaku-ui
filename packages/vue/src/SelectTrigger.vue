<script setup lang="ts">
/** Control を内側に隠す。props は Ark の Trigger に流れる */
import { Select } from "@ark-ui/vue"
import type { FieldSize } from "./types"

defineOptions({ inheritAttrs: false })
defineProps<{
  /** Input の size と同じ高さ。表の中は sm */
  size?: FieldSize
}>()
</script>

<template>
  <Select.Control>
    <Select.Trigger v-bind="$attrs" :data-size="size"><slot /></Select.Trigger>
  </Select.Control>
</template>
