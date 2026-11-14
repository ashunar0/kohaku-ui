<script setup lang="ts">
/**
 * Control / Thumb / HiddenInput を隠す。default slot がラベルになる（@kohaku/react と同じ）。
 * 入力に role="switch" を付け、ラベルを出さないときは aria-label を画面に出さないラベルにする（@kohaku/react と同じ）。
 * description（または #description slot）はラベルの下の補足。Ark の Switch には補足の部品が
 * 無く、aria-describedby もつながらないので、ここでつなぐ
 */
import { Switch } from "@ark-ui/vue"
import { computed, useAttrs, useId, useSlots } from "vue"

// aria-label をラベルの無いときだけ画面に出さないラベルにするので、attrs は自分で振り分ける
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  /** ラベルの下に出す補足。読み上げではラベルとは別に、補足として読まれる */
  description?: string
}>()
const slots = useSlots()
const id = useId()
const descId = computed(() => (props.description != null || slots.description ? `${id}-description` : undefined))
const attrs = useAttrs()
const named = computed(() => !slots.default && attrs["aria-label"] != null)
const rootAttrs = computed(() => {
  if (!named.value) return attrs
  const { "aria-label": _, ...rest } = attrs
  return rest
})
// 渡すものだけ並べる。Vue は undefined を明示すると Ark が付けた属性ごと消すため
const inputAttrs = computed(() => ({
  role: "switch",
  ...(descId.value ? { "aria-describedby": descId.value } : {}),
}))
</script>

<template>
  <Switch.Root v-bind="rootAttrs">
    <Switch.Control><Switch.Thumb /></Switch.Control>
    <Switch.Label v-if="$slots.default"><slot /></Switch.Label>
    <Switch.Label v-else-if="named" data-kh="visually-hidden" aria-hidden="true">{{ attrs["aria-label"] }}</Switch.Label>
    <span v-if="descId" :id="descId" data-scope="switch" data-part="description">
      <slot name="description">{{ description }}</slot>
    </span>
    <Switch.HiddenInput v-bind="inputAttrs" />
  </Switch.Root>
</template>
