<script setup lang="ts">
/** Ark の Item に variant を足す（@kohaku/react と同じ）。value などの props は Ark の Item に流れる */
import { Menu } from "@ark-ui/vue"

/* value は Ark の Item が必須にしているので、型を通すためにここでも宣言して渡す */
defineProps<{
  value: string
  /** 削除など危険な操作。文字が赤くなる */
  variant?: "danger"
}>()
</script>

<template>
  <Menu.Item :value="value" :data-variant="variant"><slot /></Menu.Item>
</template>
