<script setup lang="ts">
/**
 * 決まった順番で進む段階と、いまどこまで進んだか（承認経路など）。表示するだけで操作は無い（@kohaku/react と同じ）。
 * 中に TimelineItem（Timeline.Item）を並べる。丸は読み上げないので、状態の文字は中身に書く。
 */
</script>

<template>
  <ol data-kh="timeline"><slot /></ol>
</template>
