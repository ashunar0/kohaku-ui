<script setup lang="ts">
import { Dialog, Field, Select, Tabs, Tooltip, createListCollection } from "@ark-ui/vue"
import { ref } from "vue"

const invalid = ref(false)
const plans = createListCollection({
  items: [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Enterprise", value: "enterprise" },
  ],
})
const h2 = {
  fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".08em",
  color: "var(--kh-color-fg-muted)", margin: "2.5rem 0 .75rem",
} as const
</script>

<template>
  <div style="max-width: 48rem; margin: 0 auto; padding: 2rem 1rem 6rem">
    <h1 style="font-size: 1.5rem; margin: 0 0 0.25rem">kohaku — Vue playground</h1>
    <p style="color: var(--kh-color-fg-muted); font-size: 0.875rem; margin: 0 0 2rem">
      React と同じ CSS・同じ DOM になるかを検証する場所
    </p>

    <!-- Tooltip: Ark を直接使うので interactive は自分で付ける（WCAG 1.4.13） -->
    <h2 :style="{ ...h2, marginTop: 0 }">Tooltip（Ark）</h2>
    <Tooltip.Root interactive>
      <Tooltip.Trigger data-kh="button" data-variant="outline">エクスポート</Tooltip.Trigger>
      <Teleport to="body">
        <Tooltip.Positioner>
          <Tooltip.Content>CSV でダウンロード</Tooltip.Content>
        </Tooltip.Positioner>
      </Teleport>
    </Tooltip.Root>

    <!-- Tabs -->
    <h2 :style="h2">Tabs（Ark）</h2>
    <Tabs.Root default-value="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">概要</Tabs.Trigger>
        <Tabs.Trigger value="members">メンバー</Tabs.Trigger>
        <Tabs.Trigger value="billing">請求</Tabs.Trigger>
        <Tabs.Trigger value="audit" disabled>監査ログ</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <p style="margin: 0; font-size: 0.875rem">組織の基本情報と、契約中のプランを表示します。</p>
      </Tabs.Content>
      <Tabs.Content value="members">
        <p style="margin: 0; font-size: 0.875rem">招待済みのメンバーは 12 人です。</p>
      </Tabs.Content>
      <Tabs.Content value="billing">
        <p style="margin: 0; font-size: 0.875rem">次回の請求日は 11 月 25 日です。</p>
      </Tabs.Content>
    </Tabs.Root>

    <!-- Field -->
    <h2 :style="h2">Field（Ark）</h2>
    <div style="max-width: 24rem; display: grid; gap: 1rem">
      <Field.Root>
        <Field.Label>ワークスペース名</Field.Label>
        <Field.Input value="あさひの個人開発" />
        <Field.HelperText>あとから変更できます。</Field.HelperText>
      </Field.Root>

      <Field.Root :invalid="invalid" required>
        <Field.Label>
          サブドメイン
          <Field.RequiredIndicator />
        </Field.Label>
        <Field.Input value="my workspace" />
        <Field.HelperText>半角英数字とハイフン。</Field.HelperText>
        <Field.ErrorText>使用できない文字が含まれています。</Field.ErrorText>
      </Field.Root>

      <Field.Root disabled>
        <Field.Label>プラン ID</Field.Label>
        <Field.Input value="plan_free" />
        <Field.HelperText>変更できません。</Field.HelperText>
      </Field.Root>

      <button data-kh="button" data-variant="outline" data-size="sm" @click="invalid = !invalid">
        invalid を切り替え（現在: {{ invalid }}）
      </button>
    </div>

    <!-- Dialog -->
    <h2 :style="h2">Dialog（Ark）</h2>
    <Dialog.Root>
      <Dialog.Trigger as-child>
        <button data-kh="button">プロフィールを編集</button>
      </Dialog.Trigger>
      <Teleport to="body">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Title>プロフィールを編集</Dialog.Title>
            <Dialog.Description>変更内容はすぐに反映されます。</Dialog.Description>
            <Field.Root>
              <Field.Label>表示名</Field.Label>
              <Field.Input value="あさひ" />
            </Field.Root>
            <div data-kh="actions">
              <Dialog.CloseTrigger as-child>
                <button data-kh="button" data-variant="outline">キャンセル</button>
              </Dialog.CloseTrigger>
              <Dialog.CloseTrigger as-child>
                <button data-kh="button">保存する</button>
              </Dialog.CloseTrigger>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Teleport>
    </Dialog.Root>

    <!-- Select -->
    <h2 :style="h2">Select（Ark）</h2>
    <Select.Root :collection="plans" :value="['pro']" style="max-width: 16rem">
      <Select.Label>プラン</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="選択してください" />
          <Select.Indicator />
        </Select.Trigger>
      </Select.Control>
      <Teleport to="body">
        <Select.Positioner>
          <Select.Content>
            <Select.Item v-for="item in plans.items" :key="item.value" :item="item">
              <Select.ItemText>{{ item.label }}</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          </Select.Content>
        </Select.Positioner>
      </Teleport>
    </Select.Root>
  </div>
</template>
