<script setup lang="ts">
/** Teleport / Positioner を内側に隠す。props は Ark の Content に流れる */
import { Select } from "@ark-ui/vue"

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Teleport to="body">
    <Select.Positioner>
      <Select.Content v-bind="$attrs"><slot /></Select.Content>
    </Select.Positioner>
  </Teleport>
</template>
