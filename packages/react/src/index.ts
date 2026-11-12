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
export { Button, IconButton, type ButtonProps, type IconButtonProps } from "./button"
export { Badge, type BadgeProps } from "./badge"
export { Tag, type TagProps } from "./tag"
export { VisuallyHidden, type VisuallyHiddenProps } from "./visually-hidden"
export { Card, type CardRootProps } from "./card"
export { Table, type TableProps } from "./table"
export { Link, type LinkProps } from "./link"
export { Spinner, type SpinnerProps } from "./spinner"
export { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbsItemProps } from "./breadcrumbs"
export { Alert, type AlertProps, type AlertVariant } from "./alert"
export { Input, type InputProps } from "./input"
export { Textarea, type TextareaProps } from "./textarea"
export { Icon, type IconProps } from "./icon"
export { Group, Actions, Affix, type GroupProps, type ActionsProps, type AffixProps } from "./layout"
export { VStack, HStack, type VStackProps, type HStackProps, type Space } from "./stack"

// Ark に組み立て規約を被せたもの
export { Checkbox, type CheckboxProps } from "./checkbox"
export { Switch, type SwitchProps } from "./switch"
export { RadioGroup, type RadioGroupProps, type RadioGroupItemProps } from "./radio-group"
export { Dialog, type DialogContentProps } from "./dialog"
export { Select, type SelectTriggerProps, type SelectContentProps } from "./select"
export { Tooltip, type TooltipRootProps, type TooltipContentProps } from "./tooltip"
export { Popover, type PopoverContentProps } from "./popover"
export { Menu, type MenuContentProps } from "./menu"
export { DatePicker, type DatePickerProps } from "./date-picker"
export { Progress, type ProgressProps } from "./progress"
export { Pagination, type PaginationProps } from "./pagination"
export { Toast, Toaster, type ToasterProps } from "./toast"
export { FileUpload, type FileUploadProps } from "./file-upload"

// Ark をそのまま使うもの（隠すものが無いので再輸出）
export { Collapsible, Field, Fieldset, Portal, Tabs, createListCollection, createToaster, parseDate } from "@ark-ui/react"

export type { Size, FieldSize } from "./types"
