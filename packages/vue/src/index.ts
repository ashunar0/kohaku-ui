/**
 * @kohaku/vue — kohaku の Vue 向け書き味レイヤー（@kohaku/react と同じ API）
 *
 * 見た目は一切持たない。@kohaku/styles を別途読み込むこと:
 *   import "@kohaku/styles"
 *
 * このパッケージがやるのは 2 つだけ:
 *   1. data-* 属性を型付きの props にする（補完とタイポ検出）
 *   2. Ark の組み立て（Teleport / Positioner / Control）を隠し、a11y の既定と日本語の文言を足す
 *
 * kohaku が足す props 以外は、Vue の attrs のフォールスルーで Ark の部品にそのまま流れる。
 */
import {
  Checkbox as ArkCheckbox, Dialog as ArkDialog, FileUpload as ArkFileUpload,
  Pagination as ArkPagination, Popover as ArkPopover, Progress as ArkProgress,
  RadioGroup as ArkRadioGroup, Select as ArkSelect, Switch as ArkSwitch,
  Toast as ArkToast, Tooltip as ArkTooltip,
} from "@ark-ui/vue"

import CheckboxVue from "./Checkbox.vue"
import DialogContent from "./DialogContent.vue"
import FileUploadVue from "./FileUpload.vue"
import PaginationVue from "./Pagination.vue"
import PopoverContent from "./PopoverContent.vue"
import ProgressVue from "./Progress.vue"
import RadioGroupVue from "./RadioGroup.vue"
import RadioGroupItem from "./RadioGroupItem.vue"
import SelectContent from "./SelectContent.vue"
import SelectTrigger from "./SelectTrigger.vue"
import SwitchVue from "./Switch.vue"
import TooltipContent from "./TooltipContent.vue"
import TooltipRoot from "./TooltipRoot.vue"

// kohaku 独自プリミティブ
export { default as Button } from "./Button.vue"
export { default as IconButton } from "./IconButton.vue"
export { default as Badge } from "./Badge.vue"
export { default as Input } from "./Input.vue"
export { default as Textarea } from "./Textarea.vue"
export { default as Icon } from "./Icon.vue"
export { default as Group } from "./Group.vue"
export { default as Actions } from "./Actions.vue"
export { default as Affix } from "./Affix.vue"
export { Card } from "./card"
export { Alert, type AlertVariant } from "./alert"

// Ark に組み立て規約を被せたもの。隠した部品は同じ名前空間から素のまま出す（選択肢を奪わない）
export const Checkbox = Object.assign(CheckboxVue, {
  Root: ArkCheckbox.Root, Control: ArkCheckbox.Control, Indicator: ArkCheckbox.Indicator,
  Label: ArkCheckbox.Label, HiddenInput: ArkCheckbox.HiddenInput, Group: ArkCheckbox.Group,
  Context: ArkCheckbox.Context,
})
export const Switch = Object.assign(SwitchVue, {
  Root: ArkSwitch.Root, Control: ArkSwitch.Control, Thumb: ArkSwitch.Thumb,
  Label: ArkSwitch.Label, HiddenInput: ArkSwitch.HiddenInput, Context: ArkSwitch.Context,
})
export const RadioGroup = Object.assign(RadioGroupVue, {
  Item: RadioGroupItem,
  Root: ArkRadioGroup.Root, Label: ArkRadioGroup.Label, RawItem: ArkRadioGroup.Item,
  ItemControl: ArkRadioGroup.ItemControl, ItemText: ArkRadioGroup.ItemText,
  ItemHiddenInput: ArkRadioGroup.ItemHiddenInput, Indicator: ArkRadioGroup.Indicator,
  Context: ArkRadioGroup.Context, ItemContext: ArkRadioGroup.ItemContext,
})
export const Dialog = { ...ArkDialog, Content: DialogContent, RawContent: ArkDialog.Content }
export const Select = {
  ...ArkSelect, Trigger: SelectTrigger, Content: SelectContent,
  RawTrigger: ArkSelect.Trigger, RawContent: ArkSelect.Content,
}
export const Tooltip = {
  ...ArkTooltip, Root: TooltipRoot, Content: TooltipContent,
  RawRoot: ArkTooltip.Root, RawContent: ArkTooltip.Content,
}
export const Popover = { ...ArkPopover, Content: PopoverContent, RawContent: ArkPopover.Content }
export const Progress = Object.assign(ProgressVue, {
  Root: ArkProgress.Root, Label: ArkProgress.Label, ValueText: ArkProgress.ValueText,
  Track: ArkProgress.Track, Range: ArkProgress.Range, Context: ArkProgress.Context,
})
export const Pagination = Object.assign(PaginationVue, {
  Root: ArkPagination.Root, Item: ArkPagination.Item, Ellipsis: ArkPagination.Ellipsis,
  FirstTrigger: ArkPagination.FirstTrigger, PrevTrigger: ArkPagination.PrevTrigger,
  NextTrigger: ArkPagination.NextTrigger, LastTrigger: ArkPagination.LastTrigger,
  Context: ArkPagination.Context,
})
export { default as Toaster } from "./Toaster.vue"
export const Toast = ArkToast
export const FileUpload = Object.assign(FileUploadVue, {
  Root: ArkFileUpload.Root, Label: ArkFileUpload.Label, Dropzone: ArkFileUpload.Dropzone,
  Trigger: ArkFileUpload.Trigger, HiddenInput: ArkFileUpload.HiddenInput,
  ItemGroup: ArkFileUpload.ItemGroup, Item: ArkFileUpload.Item,
  ItemPreview: ArkFileUpload.ItemPreview, ItemPreviewImage: ArkFileUpload.ItemPreviewImage,
  ItemName: ArkFileUpload.ItemName, ItemSizeText: ArkFileUpload.ItemSizeText,
  ItemDeleteTrigger: ArkFileUpload.ItemDeleteTrigger, ClearTrigger: ArkFileUpload.ClearTrigger,
  Context: ArkFileUpload.Context,
})

// Ark をそのまま使うもの（隠すものが無いので再輸出）
export { Collapsible, Field, Fieldset, Tabs, createListCollection, createToaster } from "@ark-ui/vue"

export type { Size, FieldSize } from "./types"
