<script setup lang="ts">
/**
 * Teleport / Backdrop / Positioner を内側に隠す。props は Ark の Content に流れる。
 * 右上の × も置く（@kohaku/react と同じ。先頭に置くので Tab の順でも最初に来る）
 */
import { Dialog } from "@ark-ui/vue"

defineOptions({ inheritAttrs: false })
defineProps<{
  /** backdrop を出さない（非モーダルな表示など） */
  withoutBackdrop?: boolean
  /** 右上の × を出さない（どちらかを必ず選ばせたいときなど） */
  withoutCloseTrigger?: boolean
  /** × の読み上げの名前。既定は「閉じる」 */
  closeLabel?: string
}>()
</script>

<template>
  <Teleport to="body">
    <Dialog.Backdrop v-if="!withoutBackdrop" />
    <Dialog.Positioner>
      <Dialog.Content v-bind="$attrs">
        <Dialog.CloseTrigger v-if="!withoutCloseTrigger" :aria-label="closeLabel ?? '閉じる'" />
        <slot />
      </Dialog.Content>
    </Dialog.Positioner>
  </Teleport>
</template>
