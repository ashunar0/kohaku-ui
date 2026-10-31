<script setup lang="ts">
/**
 * 入力欄の外に添える単位や文字（歳・年・円）。Group の中で入力欄の隣に置く。
 * 読み上げには出さないので、入力欄の意味はラベルか aria-label で持たせる。
 */
</script>

<template>
  <span data-kh="affix" aria-hidden="true"><slot /></span>
</template>
