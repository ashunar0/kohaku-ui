import { PasswordInput as Ark, usePasswordInputContext } from "@ark-ui/react"
import type { ComponentPropsWithoutRef, MouseEvent } from "react"

type RootProps = ComponentPropsWithoutRef<typeof Ark.Root>
type InputProps = ComponentPropsWithoutRef<typeof Ark.Input>

/** 入力欄の属性（value / onChange / placeholder など）はそのまま <input> に流す。表示の状態と文言は Root へ */
export type PasswordInputProps = Omit<InputProps, "autoComplete"> &
  Pick<RootProps, "visible" | "defaultVisible" | "onVisibilityChange" | "translations" | "ignorePasswordManagers" | "autoComplete"> & {
    /** 入力欄の上に出す見出し。Field.Root の中では Field.Label を使う */
    label?: string
  }

/** Ark の既定は英語（"Show password" など）なので日本語にする */
const translations: NonNullable<RootProps["translations"]> = {
  visibilityTrigger: (visible) => (visible ? "パスワードを隠す" : "パスワードを表示"),
}

/**
 * パスワードの入力欄。右端のボタンで表示を切り替える。
 * Field.Root の中に置くと、invalid / required / disabled と入力欄の id は Field から受け取る。
 * 組み立てを自分で持ちたいときは PasswordInput.Root などの素の部品を使う。
 */
export function PasswordInput({
  label, visible, defaultVisible, onVisibilityChange, translations: t, ignorePasswordManagers, autoComplete, ...props
}: PasswordInputProps) {
  return (
    <Ark.Root
      visible={visible}
      defaultVisible={defaultVisible}
      onVisibilityChange={onVisibilityChange}
      translations={{ ...translations, ...t }}
      ignorePasswordManagers={ignorePasswordManagers}
      autoComplete={autoComplete}
    >
      {label ? <Ark.Label>{label}</Ark.Label> : null}
      <Ark.Control>
        <Ark.Input {...props} />
        <VisibilityTrigger />
      </Ark.Control>
    </Ark.Root>
  )
}

/**
 * Ark のボタンは tabIndex=-1 で、マウスで押したときしか反応しない（pointerdown だけ）。
 * キーボードだけでも切り替えられるように、Tab で止めて Enter / Space でも切り替える。
 * マウスのクリックは Ark の pointerdown が受けるので、ここではキーボード由来（detail が 0）だけ扱う
 */
function VisibilityTrigger() {
  const api = usePasswordInputContext()
  const onClick = (e: MouseEvent) => {
    if (e.detail === 0) api.toggleVisible()
  }
  return <Ark.VisibilityTrigger tabIndex={0} onClick={onClick} />
}

PasswordInput.Root = Ark.Root
PasswordInput.Label = Ark.Label
PasswordInput.Control = Ark.Control
PasswordInput.Input = Ark.Input
PasswordInput.VisibilityTrigger = Ark.VisibilityTrigger
PasswordInput.Indicator = Ark.Indicator
PasswordInput.Context = Ark.Context
PasswordInput.translations = translations
