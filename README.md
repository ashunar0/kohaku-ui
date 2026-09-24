# kohaku

FW 非依存の UI ライブラリ。**本体は CSS** で、振る舞いと a11y は [Ark UI](https://ark-ui.com) に任せる。

Ark UI が出す DOM は React / Vue / Solid / Svelte のどれでも同じなので、
`[data-scope][data-part]` を狙う CSS 1 セットで全部に効く。

```
@kohaku/styles   CSS。どの FW でも同じものを使う ← 本体
@kohaku/react    書き味レイヤー。見た目のコードは持たない
```

> 開発中。配布はプロジェクトごとにいじれるよう、shadcn のようなコピペ方式にする予定。

## 方針

- **ブランド色を持たない。** accent は無彩色。ブランド色は利用側がトークンを上書きして入れる
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
@import "tailwindcss";
@import "@kohaku/styles";
@import "@kohaku/styles/tailwind";  /* トークンを Tailwind のテーマに流す */
```

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

## トークン

```
L1 primitive   --kh-gray-900        生の値
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
