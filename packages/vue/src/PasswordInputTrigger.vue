<script setup lang="ts">
/**
 * PasswordInput の表示切り替えボタン（@kohaku/react の VisibilityTrigger と同じ）。
 * Tab で止めて、キーボード由来のクリック（detail が 0）でも切り替える。マウスは Ark の pointerdown が受ける
 */
import { PasswordInput, usePasswordInputContext } from "@ark-ui/vue"

const api = usePasswordInputContext()
const onClick = (e: MouseEvent) => {
  if (e.detail === 0) api.value.toggleVisible()
}
</script>

<template>
  <PasswordInput.VisibilityTrigger :tabindex="0" @click="onClick" />
</template>
