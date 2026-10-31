<script setup lang="ts">
/** Control を内側に隠す。props は Ark の Trigger に流れる */
import { Select } from "@ark-ui/vue"

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Select.Control>
    <Select.Trigger v-bind="$attrs"><slot /></Select.Trigger>
  </Select.Control>
</template>
