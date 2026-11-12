<script setup lang="ts">
/**
 * 選んだ値を示す札。外せる。状態を示すだけで外さないものは Badge（@kohaku/react と同じ）。
 * @remove を付けたときだけ外すボタンを出す。読み上げの既定は中身から「状態「承認待ち」を外す」を作る。
 */
import { computed, useSlots } from "vue"

const props = defineProps<{
  /** 値の種別（「状態」「取引先」など）。前に小さく出す */
  type?: string
  /** 外すボタンの読み上げ */
  removeLabel?: string
  /* emit ではなく prop で受けると、付いているかどうかで外すボタンの有無を決められる */
  onRemove?: () => void
}>()
const slots = useSlots()

const label = computed(() => {
  if (props.removeLabel) return props.removeLabel
  const text = (slots.default?.() ?? []).map((n) => (typeof n.children === "string" ? n.children : "")).join("").trim()
  return `${props.type ?? ""}「${text}」を外す`
})
</script>

<template>
  <span data-kh="tag">
    <span v-if="type" data-part="type">{{ type }}</span>
    <slot />
    <button v-if="onRemove" type="button" data-part="remove" :aria-label="label" @click="onRemove" />
  </span>
</template>
