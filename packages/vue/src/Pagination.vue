<script setup lang="ts">
/**
 * 前後のボタン・ページ番号・省略を組み立てて隠す。ラベルの既定を日本語にする（Ark は英語）。
 * type="link" のときは各ボタンを <a> にする（Ark は既定で <button> を出すため）。
 * count / pageSize / v-model:page / getPageUrl などは Ark の Root に流れる。
 */
import { Pagination, type PaginationRootProps } from "@ark-ui/vue"
import { computed } from "vue"

const props = defineProps<{
  /** 最初・最後のページへ飛ぶボタンを出す */
  showEdges?: boolean
  type?: "button" | "link"
  translations?: PaginationRootProps["translations"]
}>()

const ja: NonNullable<PaginationRootProps["translations"]> = {
  rootLabel: "ページ送り",
  firstTriggerLabel: "最初のページ",
  prevTriggerLabel: "前のページ",
  nextTriggerLabel: "次のページ",
  lastTriggerLabel: "最後のページ",
  itemLabel: ({ page, totalPages }) =>
    `${totalPages > 1 && page === totalPages ? "最後のページ、" : ""}${page} ページ目`,
}
const link = computed(() => props.type === "link")
</script>

<template>
  <Pagination.Root :type="type" :translations="{ ...ja, ...translations }">
    <Pagination.FirstTrigger v-if="showEdges" :as-child="link"><a v-if="link" /></Pagination.FirstTrigger>
    <Pagination.PrevTrigger :as-child="link"><a v-if="link" /></Pagination.PrevTrigger>
    <Pagination.Context v-slot="api">
      <template v-for="(page, i) in api.pages" :key="page.type === 'page' ? page.value : `e${i}`">
        <Pagination.Item v-if="page.type === 'page'" v-bind="page" :as-child="link">
          <a v-if="link">{{ page.value }}</a>
          <template v-else>{{ page.value }}</template>
        </Pagination.Item>
        <Pagination.Ellipsis v-else :index="i" />
      </template>
    </Pagination.Context>
    <Pagination.NextTrigger :as-child="link"><a v-if="link" /></Pagination.NextTrigger>
    <Pagination.LastTrigger v-if="showEdges" :as-child="link"><a v-if="link" /></Pagination.LastTrigger>
    <slot />
  </Pagination.Root>
</template>
