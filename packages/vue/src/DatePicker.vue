<script setup lang="ts">
/**
 * 入力欄・カレンダーの組み立てを隠す。日本語・日曜始まりが既定。
 * selectionMode="range" なら 1 つの枠に入力欄を 2 つ並べて「〜」でつなぐ。
 * v-model / v-model:open / min / max などは Ark の Root に流れる。
 * カレンダーは入力欄より広いので、中央でなく左端にそろえる（positioning の既定）。
 */
import { DatePicker, type DatePickerRootProps } from "@ark-ui/vue"
import DatePickerCalendar from "./DatePickerCalendar.vue"
import { translations as ja } from "./date-picker-text"

const props = withDefaults(defineProps<{
  /** 入力欄の上に出す見出し。無いときは aria-label などで名前を付ける */
  label?: string
  /** 範囲のときの入力欄の名前（読み上げ用） */
  inputLabels?: [string, string]
  selectionMode?: DatePickerRootProps["selectionMode"]
  locale?: string
  translations?: DatePickerRootProps["translations"]
  positioning?: DatePickerRootProps["positioning"]
}>(), { inputLabels: () => ["開始日", "終了日"], locale: "ja-JP" })
</script>

<template>
  <DatePicker.Root
    :locale="locale"
    :selection-mode="selectionMode"
    :translations="{ ...ja, ...props.translations }"
    :positioning="{ placement: 'bottom-start', ...positioning }"
  >
    <DatePicker.Label v-if="label">{{ label }}</DatePicker.Label>
    <DatePicker.Control>
      <DatePicker.Input :index="0" :aria-label="selectionMode === 'range' ? inputLabels[0] : undefined" />
      <template v-if="selectionMode === 'range'">
        <span data-kh="date-range-sep" aria-hidden="true">〜</span>
        <DatePicker.Input :index="1" :aria-label="inputLabels[1]" />
      </template>
      <DatePicker.Trigger />
    </DatePicker.Control>
    <Teleport to="body">
      <DatePicker.Positioner>
        <DatePicker.Content>
          <DatePickerCalendar />
        </DatePicker.Content>
      </DatePicker.Positioner>
    </Teleport>
    <slot />
  </DatePicker.Root>
</template>
