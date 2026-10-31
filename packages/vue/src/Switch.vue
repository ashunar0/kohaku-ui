<script setup lang="ts">
/** Control / Thumb / HiddenInput を隠す。default slot がラベルになる */
import { Switch } from "@ark-ui/vue"
</script>

<template>
  <Switch.Root>
    <Switch.Control><Switch.Thumb /></Switch.Control>
    <Switch.Label v-if="$slots.default"><slot /></Switch.Label>
    <Switch.HiddenInput />
  </Switch.Root>
</template>
