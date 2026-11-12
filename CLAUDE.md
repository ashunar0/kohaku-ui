# kohaku

FW 非依存の UI ライブラリ。**本体は CSS**で、振る舞いは Ark UI に任せる。

```
@kohaku/styles   CSS 1 枚。React / Vue / Solid / Svelte すべてで効く ← 本体
@kohaku/react    書き味レイヤー。見た目のコードは持たない
@kohaku/vue      同じ API の Vue 版（SFC）
```

Ark UI が吐く DOM は FW を問わず同一（実測済み）。そこに CSS を当てるので 1 枚で済む。

## 絶対に守ること

### 1. Ark にあるものは自作しない

**新しいコンポーネントを作る前に `docs/ark-components.md` を見る。**
一覧にあれば Ark の `[data-scope][data-part]` を CSS で狙う。無ければ kohaku が持つ。

判断基準は「**振る舞いと a11y を持つか**」。Group や Card のような見た目だけの箱は
Ark の守備範囲外なので kohaku が持つ。

過去に Field を自作しかけて指摘された。Ark にあった。

### 2. セレクタは常にグローバルな属性セレクタ

```css
[data-scope="dialog"][data-part="title"] { }   /* ✓ */
.dialog .title { }                              /* ✗ Portal を越えると壊れる */
```

Dialog や Select の中身は `<body>` 直下に飛ぶ。子孫セレクタは使えない。

### 3. component CSS に生の色を書かない

`pnpm lint:tokens` で検出される。色は `packages/styles/src/tokens.css` に定義して
`var()` で参照する。影・間隔・角丸も同様。

### 4. トークンは 3 層。利用者が触るのは L2 だけ

```
L1 primitive   --kh-blue-7          生の値。意味を持たない
L2 semantic    --kh-color-accent    役割。利用側が色を変えるならここ
L3 component   --kh-button-bg       個別調整の逃げ道
```

**「塗り」と「地の上の線・文字」で色を分ける。** 塗りは自分で地を作るのでテーマで
反転しなくてよいが、地の上に直接置かれるものは反転しないと沈む。
`--kh-color-danger`（塗り）と `--kh-color-invalid`（枠線・エラー文言）が
別なのはこのため。迷ったら「この色は自分で地を作るか？」で判断する。

**合成済みの値をトークンにしない。** custom property は宣言された場所で `var()` が
解決されるため、`:root` で組み立てると要素側の上書きが効かなくなる。使う場所で並べる。

サイズの既定値は要素に宣言せず `var(--kh-button-height, 2.5rem)` と fallback で持つ。
祖先から一括で寄せられるようにするため。

### 5. `@layer kohaku` の中に書く

```css
@layer kohaku.reset, kohaku.base, kohaku;
```

レイヤーの外の利用側 CSS が必ず勝つ。詳細度で殴らない。Tailwind の層名（`utilities`
など）を kohaku 側で宣言しない。宣言すると読み込み順で並びが変わる（Tailwind と併用する
ときは利用側が `layer(components)` で読み込む。README 参照）。

ページ全体に効くものは 2 つに分けてある。どちらも既存プロダクトには入れない。

```
reset.css   ブラウザ既定のうち困るものを消す。値は足さない
base.css    kohaku の文字組みと地の色を body に広げる。値を足す
```

**部品はこの 2 つに頼らない。** box-sizing と文字組みは `components/part.css` が
部品自身に持たせている。

### 6. `@kohaku/react` / `@kohaku/vue` に見た目のコードを書かない

やるのは 2 つだけ。`data-*` を型付き props にする / Ark の組み立てを隠す。
隠した部品は `RawContent` などで再輸出して、**選択肢を奪わない**。

**片方に足したら、もう片方にも同じものを足す。** a11y の既定（Tooltip の interactive など）と
日本語の文言（Ark の既定は英語）は書き味レイヤーにしか無いので、片方だけだと FW で差が出る。
Vue は kohaku が足す props だけ宣言し、残りは attrs のフォールスルーで Ark に流す。
**v-model と同じ名前の props を宣言したら、`update:*` を自分で emit し直す**
（Vue は宣言した側が扱うとみなして下へ流さない。Checkbox で踏んだ）。

## 見た目を変えるときの作法

### 推測で直さない

「1px ずれてる」「太く見える」は原因が直感と違うことが多い。実測してから直す。

```bash
pnpm ink <png>      # 要素のスクショから文字のインク位置を測る
```

DOM で測れるものは Playwright の `browser_evaluate` で computed style と矩形を取る。
直したあとも測り直して 0 になったことを示す。

### 選択肢は並べて描画してから聞く

文章で「A は◯◯、B は△△」と説明しない。playground に比較セクションを足して、
**同じ内容**を左右に並べる。判断が済んだら**そのセクションは消す**。

### 和文が基準

行間 1.75 / 字送り 0.02em / `font-feature-settings: "palt"`。

和文フォントの ink box は em より縦に大きく、中心が上に出る。**縦中央揃えをする場所では
必ずずれる。** 補正トークンがある。

```
--kh-icon-optical-shift    Button 内のアイコン
--kh-field-optical-shift   Input の文字（px の固定値。入力欄の文字は 1px 単位で描かれるので em 比例にしない）
```

フォントを変えたら測り直す。

### 引き算の順

```
線より先に余白     区切りは padding で作る
影より先に線       面の分離は border で作る
                   影は「浮いている」ことを示すときだけ
```

角丸は単一スケールで決めない。見え方は要素の高さに対する**比率**で決まる。
小さい要素ほど比率を上げる。L3 トークンに持たせてスケール外の値になってよい。

## 確定したら Storybook に落とす

作業中と確定後で置き場所が違う。

```
playground            作業台。比較セクションを足す・消すのはここ
Storybook              確定したものの置き場。ドキュメントとして読む用
```

**見た目と API が決まるまでは Storybook に書かない。** 途中で書くと、比較のたびに
story を直すことになる。逆に**決まったら必ず落とす**。playground は作業台なので、
そこに置きっぱなしのものは「まだ決まっていない」と読める状態にしておく。

renderer は React。参考にしている他のデザインシステムと形式を揃えるため。
Vue の確認は `playground/vue`。React の playground と同じ内容を `@kohaku/vue` で書いてあるので、
両方を開いて DOM と動きを突き合わせる。

## 判断を記録する

**判断が出たら `docs/notes.md` に追記する。**「なぜそうしたか」だけ書く。
値は `tokens.css` を見れば分かるので重複させない。
最終的に DESIGN.md を書くための素材。

## コマンド

```bash
pnpm storybook    # Storybook（確定したもの） http://localhost:6006
pnpm dev:react    # React playground        http://localhost:5174
pnpm dev:vue      # Vue playground          http://localhost:5175
pnpm lint:tokens  # component CSS に生の色が無いか
pnpm --filter @kohaku/vue typecheck   # Vue 版の型（vue-tsc は TS 7 で動かないので TS 5 系を使う）
pnpm ink <png>    # 文字のインク位置を測る
```

**確定したコンポーネントは必ず Storybook に落とす**
（落とし忘れ = 目視もテストもされていない、ということ）。
状態を並べた `States` を必ず 1 つ置き、dark でも見る。

## 方針

- **色は freee の指定カラーをそのまま使う**（https://brand.freee.co.jp/designelements/color/）。
  利用者はあさひ 1 人なので、自前で色を組むより確実で早い。L1 はパレットの写しで、段の番号も
  freee と同じ（P5 = `--kh-blue-5`、S = `--kh-gray-*`、GY = `--kh-mono-*`）。L2 の割り当ては
  freee Vibes の「色についての方針」に従い、Vibes が決めていない役割（枠線・選択の地・dark）だけ
  kohaku が決める。**パレットに無い色を作らない。** トークン名に freee は入れない（public なので）
- **a11y は WCAG 2.2 AA を目標。AAA は追わない。** 見送った項目は `docs/notes.md` の
  Known Gaps に、切り替え用の CSS ごと書いてある
- **アイコンは「部品を操作するために要る図形」だけ持つ。** チェック・丸・シェブロン・×
  は `tokens.css` に `--kh-glyph-*` として data URI で同梱する（`mask` で使い、色は
  `currentColor`）。Bootstrap も Shoelace も同じ線引き（根拠は `docs/notes.md`）。
- **Alert の variant アイコンも同梱する。** 一般にはここは持たないが、それは
  「利用側が別のアイコンセットで揃えていると絵柄が割れる」ため。**kohaku の利用者は
  あさひ 1 人で Lucide に揃えるので、割れる相手がいない。** 配る相手が増えたら見直す
- 絵柄は Lucide の幾何（viewBox 24 / stroke-width 2 / round）で統一する。
  利用側が差す svg にはサイズと位置だけ CSS が与える
- **Button のアイコンは持たない。** 何が来るか kohaku が知らないため
- **Tailwind は利用側で使う前提。** `@kohaku/styles/tailwind` でトークンを Tailwind の
  テーマに流す。上書きの境界は shadcn/lint で守る（`templates/oxlintrc.json`）
