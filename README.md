# kohaku

FW 非依存の UI ライブラリ。**本体は CSS** で、振る舞いと a11y は [Ark UI](https://ark-ui.com) に任せる。

Ark UI が出す DOM は React / Vue / Solid / Svelte のどれでも同じなので、
`[data-scope][data-part]` を狙う CSS 1 セットで全部に効く。

```
@kohaku/styles   CSS。どの FW でも同じものを使う ← 本体
@kohaku/react    書き味レイヤー。見た目のコードは持たない
@kohaku/vue      同じ API の Vue 版
```

> 開発中。配布はプロジェクトごとにいじれるよう、shadcn のようなコピペ方式にする予定。

## 方針

- **色は freee の指定カラーを使う。** 割り当ては freee Vibes に従い、決まっていない役割と dark は kohaku が決める
- **利用側の CSS / Tailwind が必ず勝つ。** kohaku の CSS はすべて `@layer kohaku` の中にある
- **和文が基準。** 行間 1.75 / 字送り 0.02em / `palt`
- **a11y は WCAG 2.2 AA が目標**

## コンポーネント

| 種類 | コンポーネント |
|---|---|
| kohaku 独自 | Button / Badge / Card / Alert / Icon / Group / Affix |
| Ark に被せる | Field / Fieldset / Input / Textarea / Checkbox / Switch / RadioGroup / Dialog / Select |

## 使い方

```css
@import "@kohaku/styles";
```

レイヤーの外に書いた CSS（Vue の `<style scoped>`、CSS Modules など）は、詳細度に関係なく
kohaku に勝つ。

### Tailwind v4 と使う

```css
@import "tailwindcss";
@import "@kohaku/styles" layer(components);  /* Tailwind の components 層に入れる */
@import "@kohaku/styles/tailwind";           /* トークンを Tailwind のテーマに流す */
```

`layer(components)` を付けないと、kohaku が Tailwind の utilities 層より後ろに並び、
`class="h-12"` が効かなくなる。Tailwind v3 は `@layer` を出力時に消すので対象外。

### 既存プロダクトに入れる

`@kohaku/styles` はページ全体に効く 2 つを含む。

| | 中身 |
|---|---|
| `reset.css` | ブラウザ既定のうち困るもの（余白・リストの点など）を消す |
| `base.css` | kohaku の文字組み（行間 1.75 など）と地の色を body に広げる |

`@kohaku/styles/components` はこの 2 つを抜いた入口。既存の画面が残っているうちは
こちらを使う（全部入れ替え終わったら既存の reset を消して `@kohaku/styles` に切り替える）。

既存のグローバル CSS は kohaku より手前の層に閉じ込める。レイヤーの外に置いたままだと、
`button { }` のような要素セレクタが kohaku の部品を上書きしてしまう。

```scss
@use "sass:meta";
@layer legacy, kohaku;

@layer legacy {
  @include meta.load-css("./global");  // 今までのグローバル SCSS（reset 含む）
}
```

```ts
// main.ts — main.scss を先に読んで層の順番を決めておく
import "./main.scss"
import "@kohaku/styles/components"
```

部品は box-sizing と文字組みを自分で持っているので、既存の reset の上でも崩れない。

### React

```tsx
import { Button, Dialog } from "@kohaku/react"

<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>開く</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>タイトル</Dialog.Title>
  </Dialog.Content>
</Dialog.Root>
```

### Vue

`@kohaku/react` と同じ名前・同じ組み立て。kohaku が足す props 以外は Ark にそのまま流れるので、
`v-model:checked` / `v-model:page` なども Ark と同じように書ける。

```vue
<script setup lang="ts">
import { Button, Dialog } from "@kohaku/vue"
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger as-child>
      <Button>開く</Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Title>タイトル</Dialog.Title>
    </Dialog.Content>
  </Dialog.Root>
</template>
```

`.vue` のまま配っているので、利用側の Vite（`@vitejs/plugin-vue`）でコンパイルされる。

## トークン

```
L1 primitive   --kh-blue-7          生の値
L2 semantic    --kh-color-accent    役割。利用側が触るのはここ
L3 component   --kh-button-bg       個別調整の逃げ道
```

## 開発

```bash
pnpm install
pnpm storybook    # 確定したもの   http://localhost:6006
pnpm dev:react    # React playground http://localhost:5174
pnpm dev:vue      # Vue playground   http://localhost:5175
pnpm lint:tokens  # component CSS に生の色が無いか
```

設計判断の記録は [`docs/notes.md`](docs/notes.md)。
