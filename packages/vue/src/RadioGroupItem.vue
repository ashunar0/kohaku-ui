<script setup lang="ts">
/**
 * ItemControl / ItemText / ItemHiddenInput を隠す。default slot がラベルになる。
 * 丸の中の点は CSS が ::after で描くので、Control に子は要らない。
 */
import { RadioGroup } from "@ark-ui/vue"

defineProps<{ value: string }>()
</script>

<template>
  <RadioGroup.Item :value="value">
    <RadioGroup.ItemControl />
    <RadioGroup.ItemText v-if="$slots.default"><slot /></RadioGroup.ItemText>
    <RadioGroup.ItemHiddenInput />
  </RadioGroup.Item>
</template>
