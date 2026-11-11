<script setup lang="ts">
/** Teleport / Positioner を内側に隠す。props は Ark の Content に流れる */
import { Menu } from "@ark-ui/vue"

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Teleport to="body">
    <Menu.Positioner>
      <Menu.Content v-bind="$attrs"><slot /></Menu.Content>
    </Menu.Positioner>
  </Teleport>
</template>
