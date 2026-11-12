<script setup lang="ts">
/**
 * title / 本文（default slot）/ icon を渡す簡易形。
 * 細かく組みたいときは Alert.Root と part を直接使う。
 */
import { computed, useSlots } from "vue"
import type { AlertVariant } from "./alert-types"

const props = defineProps<{
  variant?: AlertVariant
  /** 地を塗る。主張が強いので 1 画面に 1 枚まで */
  tone?: "soft"
  title?: string
}>()
const slots = useSlots()
// variant に既定のグリフがあるので、icon を渡さなくても空の箱を置く。
// 中身が空なら CSS が variant ごとの絵柄を描く。neutral だけ絵柄を持たない。
const hasGlyph = computed(() => props.variant !== undefined && props.variant !== "neutral")
</script>

<template>
  <div data-kh="alert" :data-variant="variant" :data-tone="tone">
    <span v-if="slots.icon" data-part="icon"><slot name="icon" /></span>
    <span v-else-if="hasGlyph" data-part="icon" />
    <p v-if="title || slots.title" data-part="title"><slot name="title">{{ title }}</slot></p>
    <div v-if="slots.default" data-part="description"><slot /></div>
  </div>
</template>
