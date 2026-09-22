/**
 * @kohaku/react — kohaku の React 向け書き味レイヤー
 *
 * 見た目は一切持たない。@kohaku/styles を別途読み込むこと:
 *   import "@kohaku/styles"
 *
 * このパッケージがやるのは 2 つだけ:
 *   1. data-* 属性を型付きの props にする（補完とタイポ検出）
 *   2. Ark の組み立て（Portal / Positioner / Control）を隠す
 */

// kohaku 独自プリミティブ
export { Button, type ButtonProps } from "./button"
export { Badge, type BadgeProps } from "./badge"
export { Card, type CardRootProps } from "./card"
export { Alert, type AlertProps, type AlertVariant } from "./alert"
export { Input, Textarea, type InputProps, type TextareaProps } from "./input"
export { Icon, type IconProps } from "./icon"
export { Group, Actions, type GroupProps, type ActionsProps } from "./layout"

// Ark に組み立て規約を被せたもの
export { Checkbox, type CheckboxProps } from "./checkbox"
export { Switch, type SwitchProps } from "./switch"
export { RadioGroup, type RadioGroupProps, type RadioGroupItemProps } from "./radio-group"
export { Dialog, type DialogContentProps } from "./dialog"
export { Select, type SelectTriggerProps, type SelectContentProps } from "./select"

// Ark をそのまま使うもの（隠すものが無いので再輸出）
export { Field, Fieldset, Portal, createListCollection } from "@ark-ui/react"

export type { Size, FieldSize } from "./types"
