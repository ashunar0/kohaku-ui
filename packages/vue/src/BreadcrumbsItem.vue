<script setup lang="ts">
/**
 * href を渡すと <a> を出す。ルーターの RouterLink を使うときは渡さず、slot に書く。
 * current は現在のページ。リンクにせず aria-current="page" を付ける（@kohaku/react と同じ）
 */
defineProps<{ href?: string; current?: boolean }>()
</script>

<template>
  <li :aria-current="current ? 'page' : undefined">
    <a v-if="href && !current" :href="href"><slot /></a>
    <slot v-else />
  </li>
</template>
