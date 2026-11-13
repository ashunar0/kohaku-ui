<script setup lang="ts">
/**
 * Control / Thumb / HiddenInput を隠す。default slot がラベルになる（@kohaku/react と同じ）。
 * description（または #description slot）はラベルの下の補足。Ark の Switch には補足の部品が
 * 無く、aria-describedby もつながらないので、ここでつなぐ
 */
import { Switch } from "@ark-ui/vue"
import { computed, useId, useSlots } from "vue"

const props = defineProps<{
  /** ラベルの下に出す補足。読み上げではラベルとは別に、補足として読まれる */
  description?: string
}>()
const slots = useSlots()
const id = useId()
const descId = computed(() => (props.description != null || slots.description ? `${id}-description` : undefined))
</script>

<template>
  <Switch.Root>
    <Switch.Control><Switch.Thumb /></Switch.Control>
    <Switch.Label v-if="$slots.default"><slot /></Switch.Label>
    <span v-if="descId" :id="descId" data-scope="switch" data-part="description">
      <slot name="description">{{ description }}</slot>
    </span>
    <Switch.HiddenInput :aria-describedby="descId" />
  </Switch.Root>
</template>
