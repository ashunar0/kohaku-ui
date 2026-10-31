<script setup lang="ts">
/**
 * Ark の Toaster に中身の組み立てを入れたもの。アプリの根元に 1 つ置き、
 * createToaster() で作った toaster から toaster.success({ title }) のように出す。
 * 中身を自分で組みたいときは default slot（引数は toast）を渡す。
 *
 * Ark の既定の名前は英語（"Notifications, …" / "Dismiss notification"）なので日本語にする。
 */
import { Toast, Toaster, type CreateToasterReturn } from "@ark-ui/vue"

defineProps<{ toaster: CreateToasterReturn }>()
</script>

<template>
  <Toaster :toaster="toaster" aria-label="通知" v-slot="t">
    <slot v-bind="t">
      <Toast.Root>
        <Toast.Title v-if="t.title != null">{{ t.title }}</Toast.Title>
        <Toast.Description v-if="t.description != null">{{ t.description }}</Toast.Description>
        <Toast.ActionTrigger v-if="t.action">{{ t.action.label }}</Toast.ActionTrigger>
        <Toast.CloseTrigger v-if="t.closable !== false" aria-label="通知を閉じる" />
      </Toast.Root>
    </slot>
  </Toaster>
</template>
