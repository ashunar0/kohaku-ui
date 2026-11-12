<script setup lang="ts">
/**
 * Field の外で使う素の入力欄。v-model が使える。
 * Field.Root の中では Ark の <Field.Input> を使うこと
 * （label との紐付けや invalid の伝播は Ark がやる）。
 *
 * #icon を渡すと枠の内側の左に置く（検索の虫眼鏡など）。飾りなので読み上げには出さない。
 * 属性は <input> に流す（@kohaku/react と同じ）。
 */
import type { FieldSize } from "./types"

defineOptions({ inheritAttrs: false })
defineProps<{ size?: FieldSize }>()
const model = defineModel<string | number>()
</script>

<template>
  <span v-if="$slots.icon" data-kh="input-icon" :data-size="size">
    <span data-part="icon" aria-hidden="true"><slot name="icon" /></span>
    <input v-model="model" data-kh="input" :data-size="size" v-bind="$attrs" />
  </span>
  <input v-else v-model="model" data-kh="input" :data-size="size" v-bind="$attrs" />
</template>
