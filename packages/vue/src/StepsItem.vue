<script setup lang="ts">
/** 段階 1 つ。state で丸の形と色が変わる（@kohaku/react と同じ） */
withDefaults(defineProps<{
  /** 完了 / いま / 差し戻し / まだ */
  state?: "done" | "current" | "rejected" | "waiting"
}>(), { state: "waiting" })
</script>

<template>
  <li data-kh="step" :data-state="state" :aria-current="state === 'current' ? 'step' : undefined">
    <span data-part="indicator" aria-hidden="true" />
    <div data-part="body"><slot /></div>
  </li>
</template>
