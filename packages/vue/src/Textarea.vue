<script setup lang="ts">
/**
 * Field の外で使う複数行の入力欄。v-model が使える。
 * Field.Root の中では Ark の <Field.Textarea> を使うこと。
 */
import type { FieldSize } from "./types"

defineProps<{ size?: FieldSize }>()
const model = defineModel<string>()
</script>

<template>
  <textarea v-model="model" data-kh="textarea" :data-size="size" />
</template>
