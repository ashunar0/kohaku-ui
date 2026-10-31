<script setup lang="ts">
/**
 * Control / Indicator / HiddenInput を隠す。default slot がラベルになる。
 * それ以外の props（checked / v-model:checked / disabled / invalid …）は Ark の Root に流れる。
 *
 * slot:
 *   indicator               チェックマークを差し替える。省略すると CSS が --kh-glyph-check を描く
 *   indeterminate-indicator indeterminate の絵柄を差し替える。省略すると --kh-glyph-minus
 *
 * Indicator を 2 つ置くのは React 版と同じ理由（素の Indicator は indeterminate のとき隠れる）。
 */
import { Checkbox, type CheckboxCheckedState } from "@ark-ui/vue"
import type { PropType } from "vue"

/* Ark Vue の checked / defaultChecked は boolean | "indeterminate" なので、
   <Checkbox default-checked> のように値を書かないと "" が渡り、true にならない。
   Boolean を先に並べて宣言し、Vue に "" → true へ変換させる。
   default を undefined にするのは、未指定を false（＝制御された未チェック）にしないため */
defineProps({
  checked: { type: [Boolean, String] as PropType<CheckboxCheckedState>, default: undefined },
  defaultChecked: { type: [Boolean, String] as PropType<CheckboxCheckedState>, default: undefined },
})
/* checked を props で宣言すると、Vue は v-model:checked の onUpdate:checked を下へ流さない
   （宣言した側が自分で扱うとみなす）。Ark の通知を受けて親へ返す */
const emit = defineEmits<{ "update:checked": [value: CheckboxCheckedState] }>()
</script>

<template>
  <Checkbox.Root :checked="checked" :default-checked="defaultChecked" @update:checked="emit('update:checked', $event)">
    <Checkbox.Control>
      <Checkbox.Indicator><slot name="indicator" /></Checkbox.Indicator>
      <Checkbox.Indicator indeterminate><slot name="indeterminate-indicator" /></Checkbox.Indicator>
    </Checkbox.Control>
    <Checkbox.Label v-if="$slots.default"><slot /></Checkbox.Label>
    <Checkbox.HiddenInput />
  </Checkbox.Root>
</template>
