<script setup lang="ts">
/**
 * 入力欄・カレンダーの組み立てを隠す。日本語・日曜始まりが既定。
 * selectionMode="range" なら 1 つの枠に入力欄を 2 つ並べて「〜」でつなぐ。
 * v-model / v-model:open / min / max などは Ark の Root に流れる。
 * カレンダーは入力欄より広いので、中央でなく左端にそろえる（positioning の既定）。
 */
import { computed, useAttrs } from "vue"
import { DatePicker, useFieldContext, type DatePickerRootProps } from "@ark-ui/vue"
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

/* Ark の DatePicker は Field と連携しない（Select などはする）。Field で包まれたら
   Select と同じものを Field から受け取る: 状態・ラベルの紐付け・補足文とエラー文言の紐付け。
   利用側が直接渡した required などは attrs のフォールスルーで後から当たるので、そちらが勝つ */
const attrs = useAttrs()
const field = useFieldContext()
const required = computed(() => {
  const own = attrs.required
  return own === undefined ? field?.value.required : own === "" || own === true || own === "true"
})
const ids = computed(() => {
  const f = field?.value
  if (!f) return attrs.ids as DatePickerRootProps["ids"]
  return {
    label: () => f.ids.label,
    input: (i: number) => (i === 0 ? f.ids.control : `${f.ids.control}::${i}`),
    ...(attrs.ids as object | undefined),
  }
})
const described = computed(() => {
  const f = field?.value
  if (!f) return {}
  return {
    "aria-describedby": f.ariaDescribedby,
    "aria-errormessage": f.invalid ? f.getInputProps()["aria-errormessage"] : undefined,
  }
})
</script>

<template>
  <DatePicker.Root
    :ids="ids"
    :disabled="field?.disabled"
    :read-only="field?.readOnly"
    :invalid="field?.invalid"
    :required="required"
    :locale="locale"
    :selection-mode="selectionMode"
    :translations="{ ...ja, ...props.translations }"
    :positioning="{ placement: 'bottom-start', ...positioning }"
  >
    <!-- data-required は任意の印を消すため（Field のラベルと同じ。field.css）。
         Field で包んだときは #label に <Field.RequiredIndicator /> を置ける -->
    <DatePicker.Label v-if="label || $slots.label" :data-required="required ? '' : undefined">
      <slot name="label">{{ label }}</slot>
    </DatePicker.Label>
    <DatePicker.Control>
      <DatePicker.Input :index="0" :aria-label="selectionMode === 'range' ? inputLabels[0] : undefined" v-bind="described" />
      <template v-if="selectionMode === 'range'">
        <span data-kh="date-range-sep" aria-hidden="true">〜</span>
        <DatePicker.Input :index="1" :aria-label="inputLabels[1]" v-bind="described" />
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
