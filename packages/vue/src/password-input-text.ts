import type { PasswordInputRootProps } from "@ark-ui/vue"

/** Ark の既定は英語（"Show password" など）なので日本語にする（@kohaku/react と同じ） */
export const translations: NonNullable<PasswordInputRootProps["translations"]> = {
  visibilityTrigger: (visible) => (visible ? "パスワードを隠す" : "パスワードを表示"),
}
