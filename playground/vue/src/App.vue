<script setup lang="ts">
import { Checkbox, Collapsible, Dialog, Field, FileUpload, Pagination, Popover, Progress, Toast, Toaster, createToaster, Select, Tabs, Tooltip, createListCollection } from "@ark-ui/vue"
import { ref } from "vue"

const invalid = ref(false)
const plans = createListCollection({
  items: [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Enterprise", value: "enterprise" },
  ],
})
// Ark の既定は英語なので、Vue では自分で渡す（React は @kohaku/react が持っている）
const paginationJa = {
  rootLabel: "ページ送り",
  prevTriggerLabel: "前のページ",
  nextTriggerLabel: "次のページ",
  itemLabel: ({ page, totalPages }: { page: number; totalPages: number }) =>
    `${totalPages > 1 && page === totalPages ? "最後のページ、" : ""}${page} ページ目`,
}
const fileUploadJa = {
  dropzone: "ファイルのドロップ領域",
  itemPreview: (file: File) => `${file.name} のプレビュー`,
  deleteFile: (file: File) => `${file.name} を削除`,
}
const toaster = createToaster({ placement: "bottom-end", overlap: true })
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

    <!-- File Upload: 名前は既定が英語なので translations を渡す -->
    <h2 :style="{ ...h2, marginTop: 0 }">File Upload（Ark）</h2>
    <div style="max-width: 28rem">
      <FileUpload.Root :max-files="3" :max-file-size="1024 * 1024" :translations="fileUploadJa">
        <FileUpload.Label>添付ファイル</FileUpload.Label>
        <!-- 中のボタンと入れ子にしないよう、領域はドロップを受けるだけにする -->
        <FileUpload.Dropzone disable-click role="group">
          <span>ここにファイルをドロップ</span>
          <FileUpload.Trigger>ファイルを選択</FileUpload.Trigger>
        </FileUpload.Dropzone>
        <FileUpload.HiddenInput />
        <FileUpload.Context v-slot="api">
          <FileUpload.ItemGroup>
            <FileUpload.Item v-for="file in api.acceptedFiles" :key="file.name" :file="file">
              <FileUpload.ItemPreview type="image/*"><FileUpload.ItemPreviewImage /></FileUpload.ItemPreview>
              <FileUpload.ItemName />
              <FileUpload.ItemSizeText />
              <FileUpload.ItemDeleteTrigger />
            </FileUpload.Item>
          </FileUpload.ItemGroup>
          <FileUpload.ItemGroup type="rejected">
            <FileUpload.Item v-for="r in api.rejectedFiles" :key="r.file.name" :file="r.file">
              <FileUpload.ItemName />
              <FileUpload.ItemSizeText>{{ r.errors.join(", ") }}</FileUpload.ItemSizeText>
              <FileUpload.ItemDeleteTrigger />
            </FileUpload.Item>
          </FileUpload.ItemGroup>
        </FileUpload.Context>
      </FileUpload.Root>
    </div>

    <!-- Toast: 名前は既定が英語なので aria-label で上書きする -->
    <h2 :style="h2">Toast（Ark）</h2>
    <Toaster :toaster="toaster" aria-label="通知" v-slot="t">
      <Toast.Root>
        <Toast.Title v-if="t.title">{{ t.title }}</Toast.Title>
        <Toast.Description v-if="t.description">{{ t.description }}</Toast.Description>
        <Toast.ActionTrigger v-if="t.action">{{ t.action.label }}</Toast.ActionTrigger>
        <Toast.CloseTrigger aria-label="通知を閉じる" />
      </Toast.Root>
    </Toaster>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
      <button data-kh="button" data-variant="outline" data-size="sm" @click="toaster.success({ title: '保存しました', description: '変更は全員に反映されます。' })">success</button>
      <button data-kh="button" data-variant="outline" data-size="sm" @click="toaster.error({ title: '保存できませんでした' })">error</button>
      <button data-kh="button" data-variant="outline" data-size="sm" @click="toaster.create({ title: '3 件を削除しました', action: { label: '元に戻す', onClick: () => {} } })">action</button>
    </div>

    <!-- Pagination -->
    <h2 :style="h2">Pagination（Ark）</h2>
    <Pagination.Root :count="200" :page-size="10" :default-page="10" :translations="paginationJa">
      <Pagination.PrevTrigger />
      <Pagination.Context v-slot="api">
        <template v-for="(page, i) in api.pages" :key="i">
          <Pagination.Item v-if="page.type === 'page'" v-bind="page">{{ page.value }}</Pagination.Item>
          <Pagination.Ellipsis v-else :index="i" />
        </template>
      </Pagination.Context>
      <Pagination.NextTrigger />
    </Pagination.Root>

    <!-- Progress: Ark は Track の名前を値（"40%"）にするので、Label に結び付ける -->
    <h2 :style="h2">Progress（Ark）</h2>
    <div style="display: grid; gap: 1.25rem; max-width: 28rem">
      <Progress.Root :default-value="40" :ids="{ label: 'upload-label' }">
        <Progress.Label>アップロード中</Progress.Label>
        <Progress.ValueText />
        <Progress.Track aria-labelledby="upload-label"><Progress.Range /></Progress.Track>
      </Progress.Root>
      <Progress.Root :default-value="null" :ids="{ label: 'loading-label' }">
        <Progress.Label>読み込み中（終わりが分からない）</Progress.Label>
        <Progress.Track aria-labelledby="loading-label"><Progress.Range /></Progress.Track>
      </Progress.Root>
    </div>

    <!-- Collapsible -->
    <h2 :style="h2">Collapsible（Ark）</h2>
    <Collapsible.Root>
      <Collapsible.Trigger>詳細な条件<Collapsible.Indicator /></Collapsible.Trigger>
      <Collapsible.Content>
        <p style="margin: 0; padding-top: 0.5rem; font-size: 0.875rem">
          登録日・最終ログイン・所属部署で絞り込めます。条件は保存され、次に開いたときも残ります。
        </p>
      </Collapsible.Content>
    </Collapsible.Root>

    <!-- Popover -->
    <h2 :style="h2">Popover（Ark）</h2>
    <Popover.Root :positioning="{ placement: 'bottom-start' }">
      <Popover.Trigger data-kh="button" data-variant="outline">表示項目</Popover.Trigger>
      <Teleport to="body">
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Title>表示する列</Popover.Title>
            <Popover.Description>一覧に出す列を選んでください。</Popover.Description>
            <div style="display: grid; gap: 0.5rem; margin-top: 0.75rem">
              <Checkbox.Root default-checked>
                <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                <Checkbox.Label>氏名</Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
              <Checkbox.Root>
                <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                <Checkbox.Label>最終ログイン</Checkbox.Label>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
            </div>
          </Popover.Content>
        </Popover.Positioner>
      </Teleport>
    </Popover.Root>

    <!-- Tooltip: Ark を直接使うので interactive は自分で付ける（WCAG 1.4.13） -->
    <h2 :style="h2">Tooltip（Ark）</h2>
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
