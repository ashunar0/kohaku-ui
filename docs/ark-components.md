# Ark UI のコンポーネント一覧

新しいコンポーネントを作る前に必ずここを見る。
**この一覧にあるものは自作しない。Ark の `data-scope` / `data-part` を CSS で狙う。**

一覧に無いもの（振る舞いを持たない、純粋な見た目・レイアウトの箱）は kohaku が持つ。
例: Button, Card, Badge, Alert, Group, Table

取得元: `chakra-ui/ark` → `packages/react/src/components`（2026-09 時点、63 件）

```
accordion, angle-slider, avatar, carousel, checkbox, client-only, clipboard,
collapsible, collection, color-picker, combobox, date-input, date-picker,
dialog, download-trigger, drawer, editable, field, fieldset, file-upload,
floating-panel, focus-trap, format, frame, highlight, hover-card,
image-cropper, json-tree-view, listbox, marquee, menu, navigation-menu,
number-input, pagination, password-input, pin-input, popover, portal,
presence, progress, qr-code, radio-group, rating-group, scroll-area,
segment-group, select, signature-pad, slider, splitter, steps, swap, switch,
tabs, tags-input, timer, toast, toc, toggle-group, toggle, tooltip, tour,
tree-view
```

## kohaku 側の対応状況

| Ark | 状態 |
|---|---|
| field | ✅ 対応済み・実機検証済み |
| dialog | ✅ 対応済み・実機検証済み |
| select | ✅ 対応済み・実機検証済み |
| fieldset | ⬜ 未対応 |
| checkbox | ✅ 対応済み・実機検証済み |
| switch | ✅ 対応済み・実機検証済み |
| radio-group | ✅ 対応済み・実機検証済み |
| tabs | ⬜ 未対応 |
| menu / popover / tooltip | ⬜ 未対応 |
| それ以外 | ⬜ 未対応 |

確定したものは Storybook で見る。検証は playground で行う。

| | URL | 起動 |
|---|---|---|
| Storybook（確定したもの） | http://localhost:6006 | `pnpm storybook` |
| React playground（作業台） | http://localhost:5174 | `pnpm dev:react` |
| Vue playground（FW 非依存の確認） | http://localhost:5175 | `pnpm dev:vue` |

## 実測した anatomy

```
field  : root / label / input / textarea / select / helper-text / error-text
         / required-indicator
dialog : trigger / backdrop / positioner / content / title / description
         / close-trigger        （backdrop と content に data-state）
select : root / label / control / trigger / value-text / indicator
         / positioner / content / item / item-text / item-indicator
         （trigger・content・item に data-state、item に data-highlighted）
checkbox    : root / label / control / indicator      （+ group）
switch      : root / label / control / thumb
radio-group : root / label / item / item-text / item-control / indicator
         （3 つとも data-state は checked / unchecked。checkbox だけ
           indeterminate も取る。hover / focus-visible / disabled /
           invalid / readonly / required が全 part に配られる）
```
