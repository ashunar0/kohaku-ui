<script setup lang="ts">
/** Teleport / Positioner を内側に隠す。props は Ark の Content に流れる */
import { Tooltip } from "@ark-ui/vue"

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Teleport to="body">
    <Tooltip.Positioner>
      <Tooltip.Content v-bind="$attrs"><slot /></Tooltip.Content>
    </Tooltip.Positioner>
  </Teleport>
</template>
