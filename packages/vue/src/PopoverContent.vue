<script setup lang="ts">
/** Teleport / Positioner を内側に隠す。props は Ark の Content に流れる */
import { Popover } from "@ark-ui/vue"

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Teleport to="body">
    <Popover.Positioner>
      <Popover.Content v-bind="$attrs"><slot /></Popover.Content>
    </Popover.Positioner>
  </Teleport>
</template>
