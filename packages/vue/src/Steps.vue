<script setup lang="ts">
/**
 * 入力を段階に分けて進める画面の、段階の表示と中身（Ark の Steps。@kohaku/react と同じ）。
 * List / Item / Trigger / Indicator / Separator を steps から組み立てて隠す。中身は Steps.Content を index ごとに置く。
 * 既定で linear（番号を押しても飛べない）。step / v-model:step は attrs で Ark に流す。
 * 表示するだけの経路（承認経路など）は Timeline を使う。
 */
import { Steps as ArkSteps } from "@ark-ui/vue"

const props = withDefaults(defineProps<{
  /** 段階の名前。数がそのまま段階の数になる */
  steps: string[]
  linear?: boolean
}>(), { linear: true })
</script>

<template>
  <ArkSteps.Root :count="props.steps.length" :linear="props.linear">
    <ArkSteps.List>
      <ArkSteps.Item v-for="(name, i) in props.steps" :key="i" :index="i">
        <ArkSteps.Trigger>
          <ArkSteps.Indicator>{{ i + 1 }}</ArkSteps.Indicator>
          <span>{{ name }}</span>
        </ArkSteps.Trigger>
        <ArkSteps.Separator v-if="i < props.steps.length - 1" />
      </ArkSteps.Item>
    </ArkSteps.List>
    <slot />
  </ArkSteps.Root>
</template>
