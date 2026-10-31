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
| fieldset | ✅ 対応済み・実機検証済み |
| checkbox | ✅ 対応済み・実機検証済み |
| switch | ✅ 対応済み・実機検証済み |
| radio-group | ✅ 対応済み・実機検証済み |
| tabs | ✅ 対応済み・実機検証済み（React / Vue で動作一致。Vue は全 trigger に aria-disabled が付く） |
| tooltip | ✅ 対応済み・実機検証済み（React / Vue で DOM 一致） |
| popover | ✅ 対応済み・実機検証済み（React / Vue で DOM・動作一致） |
| collapsible | ✅ 対応済み・実機検証済み（React / Vue で動作一致） |
| progress | ✅ 対応済み・実機検証済み（線形だけ。React / Vue で動作一致） |
| menu | ⬜ 未対応 |
| それ以外 | ⬜ 未対応 |

これから作る順番は [`roadmap.md`](roadmap.md)。

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
progress    : root / label / value-text / track / range（/ view / circle 系）
         （role="progressbar" は track。名前は値の文字列になるので label に結び付ける。
           値が無いと data-state="indeterminate"）
collapsible : root / trigger / content / indicator
         （content に Ark が --height を入れる。閉じると hidden）
popover     : trigger / anchor / positioner / content / title / description
         / close-trigger / indicator / arrow / arrow-tip
         （content は role="dialog"。開くとフォーカスが中に入り、閉じると trigger に戻る）
tooltip     : trigger / positioner / content / arrow / arrow-tip
         （positioner と content は Portal。content に data-state / data-placement。
           z-index は content に書く。Ark が positioner の --z-index に写す）
tabs        : root / list / trigger / content / indicator
         （trigger と content に data-selected、trigger に data-disabled。
           indicator は JS が --left / --width を計算する。kohaku は使わない）
radio-group : root / label / item / item-text / item-control / indicator
         （3 つとも data-state は checked / unchecked。checkbox だけ
           indeterminate も取る。hover / focus-visible / disabled /
           invalid / readonly / required が全 part に配られる）
```
