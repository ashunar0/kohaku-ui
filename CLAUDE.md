# kohaku

FW 非依存の UI ライブラリ。**本体は CSS**で、振る舞いは Ark UI に任せる。

```
@kohaku/styles   CSS 1 枚。React / Vue / Solid / Svelte すべてで効く ← 本体
@kohaku/react    書き味レイヤー。見た目のコードは持たない
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
L1 primitive   --kh-gray-900        生の値。意味を持たない
L2 semantic    --kh-color-accent    役割。ブランド色の注入はここ
L3 component   --kh-button-bg       個別調整の逃げ道
```

**合成済みの値をトークンにしない。** custom property は宣言された場所で `var()` が
解決されるため、`:root` で組み立てると要素側の上書きが効かなくなる。使う場所で並べる。

サイズの既定値は要素に宣言せず `var(--kh-button-height, 2.5rem)` と fallback で持つ。
祖先から一括で寄せられるようにするため。

### 5. `@layer kohaku` の中に書く

```css
@layer kohaku.reset, kohaku, utilities;
```

利用側の CSS / Tailwind が必ず勝つ。詳細度で殴らない。

### 6. `@kohaku/react` に見た目のコードを書かない

やるのは 2 つだけ。`data-*` を型付き props にする / Ark の組み立てを隠す。
隠した部品は `RawContent` などで再輸出して、**選択肢を奪わない**。

## 見た目を変えるときの作法

### 推測で直さない

「1px ずれてる」「太く見える」は原因が直感と違うことが多い。実測してから直す。

```bash
pnpm ink <png>      # 要素のスクショから文字のインク位置を測る
```

DOM で測れるものは Playwright の `browser_evaluate` で computed style と矩形を取る。
直したあとも測り直して 0 になったことを示す。

### 選択肢は並べて描画してから聞く

文章で「A は◯◯、B は△△」と説明しない。ギャラリーに比較セクションを足して、
**同じ内容**を左右に並べる。判断が済んだら**そのセクションは消す**。

### 和文が基準

行間 1.75 / 字送り 0.02em / `font-feature-settings: "palt"`。

和文フォントの ink box は em より縦に大きく、中心が上に出る。**縦中央揃えをする場所では
必ずずれる。** 補正トークンがある。

```
--kh-icon-optical-shift    Button 内のアイコン
--kh-field-optical-shift   Input の文字
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

## 判断を記録する

**判断が出たら `docs/notes.md` に追記する。**「なぜそうしたか」だけ書く。
値は `tokens.css` を見れば分かるので重複させない。
最終的に DESIGN.md を書くための素材。

## コマンド

```bash
pnpm dev          # ギャラリー（素の HTML）  http://localhost:5173
pnpm dev:react    # React playground        http://localhost:5174
pnpm dev:vue      # Vue playground          http://localhost:5175
pnpm lint:tokens  # component CSS に生の色が無いか
pnpm ink <png>    # 文字のインク位置を測る
```

ギャラリーは自動リロードする。新しいコンポーネントを作ったら**必ずギャラリーに足す**
（載せ忘れ = 目視もテストもされていない、ということ）。

## 方針

- **ブランド色を持たない。** accent は無彩色。ブランド色は利用側が L2 を 3 行上書きして注入
- **a11y は WCAG 2.2 AA を目標。AAA は追わない。** 見送った項目は `docs/notes.md` の
  Known Gaps に、切り替え用の CSS ごと書いてある
- **アイコンは「部品を操作するために要る図形」だけ持つ。** チェック・丸・シェブロン・×
  は `tokens.css` に `--kh-glyph-*` として data URI で同梱する（`mask` で使い、色は
  `currentColor`）。Alert の警告アイコンのような**中身を説明するアイコンは持たない** ——
  利用側のアイコンセットと絵柄が割れるため。Bootstrap も Shoelace も同じ線引き
  （根拠は `docs/notes.md`）。絵柄は Lucide の幾何（viewBox 24 / stroke-width 2 / round）
  を基準にし、利用側が差す svg にはサイズと位置だけ CSS が与える
- **Tailwind は利用側で使う前提。** `@kohaku/styles/tailwind` でトークンを Tailwind の
  テーマに流す。上書きの境界は shadcn/lint で守る（`templates/oxlintrc.json`）
