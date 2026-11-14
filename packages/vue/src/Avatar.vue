<script setup lang="ts">
/**
 * 利用者のアイコン。Image / Fallback の組み立てを隠す（@kohaku/react と同じ）。
 *
 * 名前の文字と並べて置くのがふつうなので、既定では読み上げない（aria-hidden）。
 * 名前が隣に無いところに単独で置くときは、:aria-hidden="false" にして aria-label で名前を付ける。
 * 渡された属性は attrs のフォールスルーで Root に流れ、既定の aria-hidden より後に当たる。
 */
import { Avatar } from "@ark-ui/vue"
import { computed } from "vue"

const props = defineProps<{
  /** 利用者の名前。画像が無い・読み込めないときは 1 文字目を出す。画像の代わりの文字（alt）にもなる */
  name: string
  /** 画像の URL */
  src?: string
}>()
const initial = computed(() => Array.from(props.name.trim())[0])
</script>

<template>
  <Avatar.Root aria-hidden="true">
    <Avatar.Fallback>{{ initial }}</Avatar.Fallback>
    <Avatar.Image v-if="src" :src="src" :alt="name" />
  </Avatar.Root>
</template>
