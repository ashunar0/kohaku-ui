<script setup lang="ts">
/** 操作の行。既定は右寄せ */
defineProps<{ align?: "start" | "end" | "between" }>()
</script>

<template>
  <div data-kh="actions" :data-align="align === 'end' ? undefined : align"><slot /></div>
</template>
