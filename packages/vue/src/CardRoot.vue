<script setup lang="ts">
defineProps<{
  /** 地から浮かせる。並べて置くカードは flat のままにする */
  elevated?: boolean
  /** header / footer の境界に線を引く。既定は余白だけで区切る */
  divided?: boolean
}>()
</script>

<template>
  <div data-kh="card" :data-elevated="elevated ? '' : undefined" :data-divided="divided ? '' : undefined"><slot /></div>
</template>
