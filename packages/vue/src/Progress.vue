<script setup lang="ts">
/**
 * Track / Range を隠す。value を渡さないと「終わりが分からない読み込み中」になる。
 *
 * Ark は role="progressbar" を Track に付け、名前を値の文字列（"40%"）にする。
 * それだと「何の」進み具合か読み上げられないので、Track を Label に結び付ける。
 * label が無いときは、渡された aria-label を Track に移す。
 */
import { Progress } from "@ark-ui/vue"
import { computed, useAttrs, useId, useSlots } from "vue"

defineOptions({ inheritAttrs: false })
const props = defineProps<{
  /** 何の進み具合か。省略するときは aria-label を付ける */
  label?: string
  /** 右上に「40%」のような値を出す */
  showValue?: boolean
  ids?: Record<string, string>
}>()
const attrs = useAttrs()
const slots = useSlots()
const labelId = useId()

const hasLabel = computed(() => props.label != null || !!slots.label)
const rootAttrs = computed(() => {
  const { "aria-label": _, ...rest } = attrs
  return rest
})
// 渡すものだけ並べる。Vue は undefined を明示すると Ark が付けた属性ごと消すため
const trackAttrs = computed(() =>
  hasLabel.value
    ? { "aria-labelledby": props.ids?.label ?? labelId }
    : { "aria-label": attrs["aria-label"] as string | undefined },
)
</script>

<template>
  <Progress.Root v-bind="rootAttrs" :ids="{ label: labelId, ...ids }">
    <Progress.Label v-if="hasLabel"><slot name="label">{{ label }}</slot></Progress.Label>
    <Progress.ValueText v-if="showValue" />
    <Progress.Track v-bind="trackAttrs">
      <Progress.Range />
    </Progress.Track>
    <slot />
  </Progress.Root>
</template>
