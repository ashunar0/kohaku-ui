<script setup lang="ts">
/**
 * 素の <table> を div[data-kh="table"] で包む。中身は thead / tr / td をそのまま書く。
 * 属性は <table> に流す（@kohaku/react の Table と同じ）
 */
defineOptions({ inheritAttrs: false })
</script>

<template>
  <div data-kh="table"><table v-bind="$attrs"><slot /></table></div>
</template>
