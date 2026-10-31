<script setup lang="ts">
/**
 * Field の外で使う素の入力欄。v-model が使える。
 * Field.Root の中では Ark の <Field.Input> を使うこと
 * （label との紐付けや invalid の伝播は Ark がやる）。
 */
import type { FieldSize } from "./types"

defineProps<{ size?: FieldSize }>()
const model = defineModel<string | number>()
</script>

<template>
  <input v-model="model" data-kh="input" :data-size="size" />
</template>
