<script setup lang="ts">
/**
 * パスワードの入力欄。右端のボタンで表示を切り替える（@kohaku/react と同じ）。
 * v-model と、placeholder などの属性は <input> に流す。表示の状態と文言は Root へ。
 * Field.Root の中に置くと、invalid / required / disabled と入力欄の id は Field から受け取る。
 *
 * Ark のボタンは tabIndex=-1 で、マウスで押したときしか反応しない。Tab で止めてキーボードでも
 * 切り替えられるようにする（PasswordInputTrigger.vue）
 */
import { PasswordInput, type PasswordInputRootProps } from "@ark-ui/vue"
import PasswordInputTrigger from "./PasswordInputTrigger.vue"
import { translations as ja } from "./password-input-text"

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  /** 入力欄の上に出す見出し。Field.Root の中では Field.Label を使う */
  label?: string
  visible?: boolean
  defaultVisible?: boolean
  ignorePasswordManagers?: boolean
  autoComplete?: PasswordInputRootProps["autoComplete"]
  translations?: PasswordInputRootProps["translations"]
}>(), { visible: undefined, defaultVisible: undefined, ignorePasswordManagers: undefined })
const emit = defineEmits<{ "update:visible": [boolean] }>()
const model = defineModel<string>()
</script>

<template>
  <PasswordInput.Root
    :visible="visible"
    :default-visible="defaultVisible"
    :ignore-password-managers="ignorePasswordManagers"
    :auto-complete="autoComplete"
    :translations="{ ...ja, ...props.translations }"
    @visibility-change="(d) => emit('update:visible', d.visible)"
  >
    <PasswordInput.Label v-if="label">{{ label }}</PasswordInput.Label>
    <PasswordInput.Control>
      <PasswordInput.Input
        v-bind="$attrs"
        :value="model"
        @input="(e: Event) => (model = (e.target as HTMLInputElement).value)"
      />
      <PasswordInputTrigger />
    </PasswordInput.Control>
  </PasswordInput.Root>
</template>
