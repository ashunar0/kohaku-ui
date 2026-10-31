<script setup lang="ts">
/** Teleport / Backdrop / Positioner を内側に隠す。props は Ark の Content に流れる */
import { Dialog } from "@ark-ui/vue"

defineOptions({ inheritAttrs: false })
defineProps<{
  /** backdrop を出さない（非モーダルな表示など） */
  withoutBackdrop?: boolean
}>()
</script>

<template>
  <Teleport to="body">
    <Dialog.Backdrop v-if="!withoutBackdrop" />
    <Dialog.Positioner>
      <Dialog.Content v-bind="$attrs"><slot /></Dialog.Content>
    </Dialog.Positioner>
  </Teleport>
</template>
