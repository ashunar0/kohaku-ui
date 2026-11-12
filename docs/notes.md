# 決定ログ

DESIGN.md を書くための素材置き場。判断が出るたびに追記する。
「なぜそうしたか」だけを書く。値そのものは `src/tokens.css` を見ればよい。

---

## 角丸は単一スケールで決めない

角丸の見え方は絶対値ではなく **要素の高さに対する比率** で決まる。
小さい要素ほど比率を上げないと角が立って見える。

| | 高さ | 角丸 | 比 | |
|---|---|---|---|---|
| Button md | 36px | 8px | 0.22 | ちょうど |
| Badge | 22px | 4px | 0.18 | 足りない |
| Badge | 22px | **6px** | **0.27** | ちょうど |
| Badge | 22px | 8px | 0.36 | 丸すぎる |

→ 角丸はコンポーネントごとに光学的に決める。L3 トークン（`--kh-badge-radius`）に持たせ、
   スケール外の値になってもよい。スケールはあくまで出発点。

## アイコンは同梱せず、幾何の規約だけ決める

アイコンは CSS ではなくマークアップなので、CSS だけのライブラリが抱えると
FW 非依存が崩れる。Lucide の幾何（viewBox 24 / stroke-width 2 / round / currentColor）
を基準として、サイズと位置だけ CSS が管理する。

Lucide の絵柄は 24 グリッドのうち約 20 しか使わないため、`1em` 指定では
em を丸ごと埋める和文グリフより一回り小さく見える。文字サイズより一段大きい
実寸を当てる（14px 文字 → 16px アイコン）。

## Alert の既定は中立。色を持つのはアイコンだけ

左のカラーバーと地の塗りは主張が強すぎ、画面に複数置くと全部が効かなくなる。
既定は `surface` + `border` の中立な面にして、status はアイコンの色だけで伝える。
地を塗る版は `data-tone="soft"` に隔離し、1 画面に 1 枚までとする。

## ブランド色を持たない

accent は無彩色（light = #18181a / dark = #fafafb）。
ブランド色は利用側が L2 を 3 行上書きして注入する。
意味が固定されている status（danger / warning / success / info）だけ既定値を持つ。

## 和文を基準にタイポグラフィを組む

和文は字面が大きく密度が高いので、欧文と同じ行間・字送りでは詰まって見える。
行間 1.75 / 字送り 0.02em / `font-feature-settings: "palt"` を既定とする。

また和文スタックの ink box は em より縦に大きく、中心が em 中心よりわずかに上に出る。
flex 中央揃えでアイコンと並べると約 0.036em ずれるため、`--kh-icon-optical-shift` で補正する。

## 影より先に線で区切る

flat が既定。`border` で面を分け、持ち上げる必要があるときだけ影を足す。
暗い地の上では影がほとんど見えないため、dark では影トークンを 1px の輪郭に差し替える。

## 区切り線は既定で引かない

Card の header / footer の境界線は既定では出さない。padding のリズムだけで
区画は十分に伝わる。線を足すと情報量が増えていないのに視覚的な密度だけ上がる。

本当に別物の区画を分けるときだけ `data-divided` で明示的に引く。
「影より先に線」と同じ原則の一段下 —— **線より先に余白**。

## 使えない濃さはトークンに置かない

`--kh-color-border-soft` (#f4f4f5) は白い面 (#ffffff) との差が L で 0.03 しかなく、
dark では surface と同色になって完全に不可視だった。「控えめな区切り線」のつもりが
「無い線」になっていた。

→ 廃止し、border は 2 段（`border` / `border-strong`）にした。
   **トークンは「使える値」だけを持つ。** 選べる選択肢が全部使えることが、
   選ぶ側の判断を速くする。

## focus リングは「離す」か「重ねる」かを要素ごとに決める

まず前提として、`box-shadow: 0 0 0 2px canvas, 0 0 0 4px ring` のように
**リングの隙間を地の色で塗る**方式は使わない。地の色を決め打ちすることになり、
白い Card の上に置いた瞬間に灰色の輪が浮いて「枠線がずれている」ように見える。

その上で、枠線を持つかどうかで方式が分かれる。

**枠線を持つ要素（Input / Textarea / Select）→ 枠に重ねる**

```css
border-color: var(--kh-color-ring);
box-shadow: inset 0 0 0 var(--kh-ring-inset) var(--kh-color-ring);
```

離して描くと隙間の分だけ「ずれている」と読まれる。要素自身の角丸矩形を
そのまま使えば構造上ずれようがない。inset shadow は padding box に沿うので
角も完全に同心。border 1px + inset 1px = 見た目 2px の枠。

**枠線を持たない要素（Button）→ 離して描く**

```css
outline: var(--kh-ring-width) solid var(--kh-color-ring);
outline-offset: var(--kh-ring-offset);
```

塗りつぶしの上に重ねてもリングが埋もれるため、外に出す。
`outline-offset` の隙間は透明なので地の色を決め打ちしない。

**合成済みの値をトークンにしない**

`--kh-focus-ring: 0 0 0 2px ... var(--kh-color-ring)` を `:root` で組み立てていたとき、
要素側で `--kh-color-ring` を赤に上書きしてもリングは黒のままだった。
custom property は**宣言された場所**で var() が解決されるため。
使う場所で var() を並べること。

## Ark にあるものは自作しない（Field の取りこぼし）

`data-kh="label"` / `help` / `error` を自作していたが、**Field は Ark UI のコンポーネント**
（Field.Root / Label / Input / Textarea / Select / HelperText / ErrorText / RequiredIndicator）。
kohaku のルールは「Ark にあるものは Ark の属性を狙う」なので、これは方針違反だった。

→ CSS は `[data-scope="field"][data-part="label"]` を第一に狙い、
   Ark を使わない素の HTML 用に `data-kh="label"` を併記する。

**新しいコンポーネントを作る前に、Ark の一覧に無いか確認する。**

## Field と Group は別物

| | 役割 | 方向 |
|---|---|---|
| Field | label + control + help/error を束ね、invalid / disabled を全 part に配る | 縦 |
| Group | コントロールを横に並べ、高さを揃える・連結する | 横 |

## コントロールの高さは 40px で統一する

Button 単体は 36px の方が締まって見えたが、40px に統一した。理由は 2 つ。

1. **フォームで必ず Input と並ぶ。** 揃っていない方が後で効いてくる
2. **日本のデザインシステムはボタンを大きめに取る傾向がある。**
   SmartHR はモバイルで「小」サイズを使わないよう明記している（操作ミスが増えるため）

サイズの段は Button と Field で完全に一致させる（36 / 40 / 44）。
密なツールバー用に Button だけ `xs`（28px）を持つ。

| | xs | sm | md（既定） | lg |
|---|---|---|---|---|
| Button | 28px | 36px | **40px** | 44px |
| Field | — | 36px | **40px** | 44px |

「Button 単体は詰まっている方が良い」という観察自体は正しい。
**一貫性がその差分より価値がある**と判断した、という記録。

サイズの既定値は要素に宣言せず `var(--kh-button-height, 2.25rem)` と fallback で持つ。
こうすると祖先から一括で寄せられる。`data-size` を明示したものは要素側が勝つ。

## 和文は「中央揃え」しても中央に来ない

和文フォントの ink box は em より縦に大きく、中心が em 中心よりわずかに**上**に出る。
ブラウザは行ボックスを中央に置くが、その中でグリフが中央に来ない。
結果、高さ固定の Input では文字が 1px 上にずれる（実測 @14px / 40px）。

これは Input に限らず、**縦中央揃えをする全ての場所**で起きる。
既に 2 箇所で補正している。

| 場所 | 補正 | 値 |
|---|---|---|
| Button 内のアイコン | `margin-bottom` | `--kh-icon-optical-shift: 0.072em` |
| Input の文字 | `padding-block` を非対称に | `--kh-field-optical-shift: 0.07em` |

高さ固定の要素では、上下 padding の**差の半分**だけ中心が動く。
差 `2 × shift` で `shift` ぶん下がる。

### 測り方

目視では判断できないので、要素だけをスクリーンショットして
ピクセルのインク位置を測る。`scripts/ink.mjs` がそれをやる。

```bash
pnpm ink .playwright-mcp/input-jp.png
```

インク行の上端・下端から中心を出し、枠の中心との差を px で返す。
**フォントを変えたら測り直す。** 補正値はフォント固有の値なので。

## focus リングは青 1px

黒 2px は「太い」と読まれた。原因は太さではなく**明度差**だった。
白地との差が黒は 0.86、青は 0.38 と半分以下になるため、同じ太さでも圧が全く違う。

さらに 1px まで落としても、非フォーカスとの差が**色相**になるので気づける。
黒 1px は明度差だけになるため見つけにくい。

```css
--kh-color-ring:  var(--kh-blue-500);
--kh-ring-inset:  0;        /* border の 1px だけ */
--kh-ring-width:  1px;      /* Button 等、離して描く場合 */
```

太さは Input（枠線 1px）と Button（離して 1px）で揃える。
片方だけ 2px だと、同じ「フォーカス」という状態なのに強さが違って見える。

青は `--kh-color-info` ではなく **L1 primitive から直接引く**。
focus は「状態」であって「意味」ではないので、info の色を変えたときに
focus が追従してはいけない。

### 未決: accent に連動させるか

`--kh-color-ring: var(--kh-color-accent)` にすると、ブランド色を注入した利用者は
focus リングも自動でブランド色になる（Chakra / Radix はこの作り）。
一方で「focus は常に青」の方が予測しやすいという利点もある。
利用側で 1 行変えれば済むので、既定は青のままにして保留。

## a11y の到達点と、意図的に見送ったもの

方針: **WCAG 2.2 AA を目標**。AAA は追わない。

### 満たしているもの

| 基準 | 内容 | 状態 |
|---|---|---|
| 2.4.7 Focus Visible (AA) | フォーカスが見えること | ✅ |
| 1.4.3 Contrast (AA) | テキスト 4.5:1 | ✅ placeholder を fg-muted に修正して達成 |
| 1.4.11 Non-text Contrast (AA) | focus リング | ✅ 青 #2b7fff は白地 3.76:1 |

focus リングは 1px だが、**色で 3:1 を超えている**ので Focus Visible としては十分。

### 意図的に見送ったもの（Known Gaps）

**1.4.11 Non-text Contrast (AA) — 枠線**

| 対象 | 現在 | 白地とのコントラスト | 必要 |
|---|---|---|---|
| input の枠線 `border-strong` | S5 `#d7d2d2` | 1.50:1 | 3:1 |
| card の枠線 `border` | S4 `#e1dcdc` | 1.36:1 | 3:1 |

3:1 を満たすには S8 `#8c8989`（3.47:1）まで濃くする必要があり、トンマナが「線が強い」方向に
大きく振れる。shadcn / Vercel / Linear も同様に満たしていない。
個人利用のため現状維持とし、**必要になった時点でトークン 1 行で切り替える**。

```css
:root {
  --kh-color-border:        var(--kh-gray-8);
  --kh-color-border-strong: var(--kh-gray-8);
}
```

**2.4.13 Focus Appearance (AAA)** — 2px 以上を求めるが 1px を採用。AAA なので追わない。
必要になったら `--kh-ring-width: 2px; --kh-ring-inset: 1px;`。

### 測り方

`scripts/` には入れていない。コントラスト比は
`(明るい方の相対輝度 + 0.05) / (暗い方 + 0.05)` で出す。

## Ark UI への CSS 適用を実機で検証した（2026-09-22）

`playground/react`（Vite + React 19 + @ark-ui/react 5.39）で確認。

### 確認できたこと

**1. part 名は推測どおりだった**

```
field  : root / label / input / helper-text / error-text / required-indicator
dialog : trigger / backdrop / positioner / content / title / description / close-trigger
select : root / label / control / trigger / value-text / indicator /
         positioner / content / item / item-text / item-indicator
```

**2. 状態は root から全 part に配られる**

`<Field.Root invalid>` だけで:

```
root       : data-invalid
label      : data-required data-invalid
input      : data-invalid aria-invalid="true" aria-errormessage="..."
error-text : aria-live="polite"（invalid のときだけ描画される）
```

kohaku 側は `[data-part="input"][data-invalid]` を書くだけでよい。
`aria-*` は一切書かなくてよい。

disabled は input には `data-disabled` ではなく **native の `disabled`** が付く。
`:disabled` で拾えばよい（root / label / helper-text には `data-disabled` が付く）。

**3. Portal を越えても CSS が当たる**

Dialog の content は `<body>` 直下に移動するが、kohaku のセレクタは
`[data-scope][data-part]` という**グローバルな属性セレクタ**なので影響を受けない。
子孫セレクタに依存していたら壊れていた。これが data 属性方式の効きどころ。

**4. Ark が面倒を見てくれる部分**

`Select.ItemIndicator` は未選択時に `hidden` 属性が付く。CSS で隠す必要はない。

### 結論

> **Ark の DOM に CSS を当てれば、FW を問わず 1 枚で効く**

という kohaku の前提は成立している。残る検証は「React 以外でも同じ DOM が出るか」で、
これは Solid の playground を立てて確かめる。

## React と Vue で DOM が一致することを実測（2026-09-22）

`playground/react`（React 19 / @ark-ui/react 5.39）と
`playground/vue`（Vue 3.5 / @ark-ui/vue 5.39）で、Field・Dialog・Select を
同じ構成で描画し、`[data-scope]` を持つ全ノードの署名を突き合わせた。

**結果: 41 ノード、構造・属性・computed style すべて一致。**

```
dialog content : backgroundColor / borderRadius / maxWidth / padding / boxShadow  完全一致
select trigger : height / borderRadius / paddingInlineStart / borderColor        完全一致
field label    : fontSize / fontWeight / color / marginBottom                    完全一致
field input    : height / padding / borderColor / fontSize                       完全一致
```

差分は 2 つだけで、どちらも CSS に影響しない。

1. **id 生成が違う**（React `_r_3_` / Vue `v-3`）。`data-ownedby` や
   `data-activedescendant` に現れるが、kohaku の CSS は id を一切見ていない
2. マークアップの書き方が違う（React は `<Portal>`、Vue は `<Teleport to="body">`。
   `defaultValue` は Vue の Field.Input が受け取らないので `value` を使う）
   → **書き方は違っても出力される DOM は同じ**

### これで確定したこと

> **kohaku の CSS は 1 枚で React でも Vue でも同じ見た目になる。**

ライブラリの前提が実測で裏付けられた。Solid / Svelte も Ark が同じ Zag の
machine を使っている以上、同じ DOM が出るはず（未検証）。

## @kohaku/react を作った（2026-09-22）

CSS が固まった 10 個について React の書き味レイヤーを用意した。
**見た目のコードは 1 行も入れない。**やることは 2 つだけ。

1. `data-*` を型付きの props にする（補完が効き、タイポが型エラーになる）
2. Ark の組み立て（Portal / Backdrop / Positioner / Control）を隠す

```tsx
// 素の Ark
<Dialog.Root>
  <Portal><Dialog.Backdrop /><Dialog.Positioner>
    <Dialog.Content>…</Dialog.Content>
  </Dialog.Positioner></Portal>
</Dialog.Root>

// @kohaku/react
<Dialog.Root>
  <Dialog.Content>…</Dialog.Content>
</Dialog.Root>
```

### 出力 DOM が変わらないことを実測

ラッパー経由で描画した Dialog（8 ノード）と Select（17 ノード）の署名が、
素の Ark で書いたものと**完全に一致**した。つまり:

- ラッパーは DOM を一切変えない → CSS は書き方に依存しない
- ラッパーを使わない FW（Vue / Solid）でも同じ CSS がそのまま効く

### 逃げ道を残す

隠した部品は `Dialog.Backdrop` / `Dialog.Positioner` / `Dialog.RawContent`、
`Select.Control` / `Select.RawTrigger` / `Select.RawContent` として再輸出してある。
Portal を使いたくない場合などに素の構造で組める。
**隠すことで選択肢を奪わない。**

### Known Gap

`exports` が `./src/index.ts` を直接指している（TSX をそのまま配っている）。
publish する前にビルド（tsup など）が必要。playground は Vite が解決するので今は動く。

## checkbox / switch / radio-group を入れた（2026-09-22）

Ark にある 3 つ。anatomy は `@zag-js/*` の `*.anatomy.mjs` から直接取った。

```
checkbox    : root / label / control / indicator      （+ group、今は未使用）
switch      : root / label / control / thumb
radio-group : root / label / item / item-text / item-control / indicator
```

`data-state` は `checked` / `unchecked`（checkbox だけ `indeterminate`）。
`data-hover` / `data-focus-visible` / `data-disabled` / `data-invalid` は全 part に配られる。

radio-group の `indicator` は「選択位置を滑らせるハイライト」で segmented control 用。
素のラジオでは使わないので CSS も持たない。

### Ark が `hidden` を付ける part に `display` を書かない

**Dialog が閉じているのに画面中央に出たまま消えない**バグが見つかった。原因は
kohaku の CSS が `[data-part="content"] { display: flex }` と書いていたこと。

`hidden` 属性そのものに要素を消す力は無い。効いているのは UA スタイルシートの
`[hidden] { display: none }` という 1 行だけ。そして CSS のカスケードは詳細度や
レイヤーより先に **origin**（どこで宣言されたか）を見る。

```
UA スタイルシート  <  利用者スタイル  <  author（kohaku の CSS）
```

つまり author の `display` 宣言は、詳細度が何であれ `@layer` の何段目であれ、
**UA の `display: none` に無条件で勝ってしまう**。Ark は `hidden` を付けるところまでが
仕事で、その先は CSS 側の責任。Ark が `display: none !important` を差し込めば防げるが、
それをやると利用側がアニメーションも位置調整もできなくなるので、付けていないのが正しい。

気づかなかったのは、閉じた content に `kh-dialog-out` が当たっていて**読み込み直後に
1 回だけ走る**から。`forwards` が無いので走り終わると opacity が 1 に戻り、出っぱなしになる。
前回の検証は「開いたときの見た目」しか測っておらず、**閉じている状態を測っていなかった**。

対処は `display` だけを `:not([hidden])` に限ること。

```css
[data-scope="dialog"][data-part="content"]:not([hidden]) { display: flex; }
```

**これは Ark を CSS で狙うライブラリの構造的な罠なので、規約として扱う。**
select の content は `display` を書いていなかったので無事だった。checkbox の
indicator は最初からこの形で書いてある。機械的に検出できるはず（lint 候補）。

### 円の中の点は「直径」ではなく「縁からの距離」で持つ

radio の白い点が中心からずれて見えた。幾何は合っていて、原因はラスタライズだった。

```
外径 18px − border 1px × 2 = 中身 16px
(16 − 7) / 2 = 4.5px        ← デバイスピクセルに乗らない
```

`place-items: center` は余白を数学的に等分するが、0.5px はどちらかに寄せるしかない。
点が小さいほど 1px の比重が大きく、7px の点では直径の 14% のズレになる。
DPR 2 では 9 デバイスpx で割り切れるためズレず、**画面によって出たり出なかったりする**。

直径ではなく inset を持てば、余白は定義上いつも整数になる。

```css
--kh-radio-dot-size: calc(
  var(--kh-radio-size, 1.125rem)
  - var(--kh-radio-border, 1px) * 2
  - var(--kh-radio-dot-inset, 4px) * 2
);
```

16 / 18 / 20 / 24 / 32px で振って、全て余白 4px ちょうどを確認した。
checkbox（余白 2px）と switch（上下 2px / 移動 12px）は元から整数だった。

### 和文の光学補正は入れない

Button のアイコンには `--kh-icon-optical-shift` を入れたので、ラベルと control の
あいだにも同じ補正が要ると思って測った。**要らなかった。**

ラベル 17 本でインク中心と control 中心のズレを測ると **−0.18px 〜 +0.60px、
中央値 +0.12px**。符号が文字列ごとに反転する（「週次の〜」−0.18、「Enterprise — 監査
ログつき」+0.60）。これはフォントの系統誤差ではなく、**その文字列にディセンダや欧文
大文字が入るかどうかの差**。固定値で補正すると特定の文字列に過剰適合する。

Button と違うのは、あちらが `line-height: 1` の箱に置いたアイコンで、こちらが
行ボックス同士の突き合わせだから。**補正が要るかどうかは毎回測って決める。**

### switch の off トラックは border-strong、つまみは影で分ける

off のトラックを濃くする案（fg-muted / 4.6:1・1.4.11 を満たす）と薄くする案
（border-strong / 1.42:1・input の枠線と同じ濃さ）を並べて、**薄い方を選んだ**。
濃いトラックは off の switch が黒く重すぎた。

薄くすると白いつまみとの差が 1.48:1 しか残らないので、つまみを分離する必要が出る。
線と影を並べて **影**を選んだ。つまみは物理的に「トラックの中で浮いている」ものなので、
kohaku で影を使ってよい数少ない場面。

`--kh-shadow-thumb` として持つ。`--kh-shadow-sm`（4%）では薄いトラックとの差を
作れないため専用に用意した。面が小さいので 30% でも重く見えない。

**dark で一度やらかした。** 最初つまみを `--kh-color-surface` にしたため、dark で
`#18181a` になって暗いトラックに沈んだ（1.69:1）。そこを `--kh-shadow-sm` が dark で
線に置き換わるのと同じ方針で「1px の明るい輪」にしたら、**つまみが縁取られて
見た目が壊れた**。輪郭のあるノブは物として見えない。

Chakra の switch recipe を見たら off のつまみは light / dark とも `bg: white` だった。
**つまみは物理的なノブなので、明るいことがそもそも常態**で、トラックとの差は色自体が
作る。`--kh-color-thumb`（light 白 / dark gray-300）として持ち直したら、dark の
off は 7.09:1、on は 17:1 になり、**dark では影に仕事をさせなくて済む**。

沈んだのは「つまみはトラックの反対側の明度」という当初の規則が間違っていたからで、
影の置き換え方の問題ではなかった。**`--kh-shadow-thumb` は dark でも影のまま**。
影を線に置き換えるのは面を持ち上げるとき（card / dialog）の作法であって、
中で動く部品には当てはまらない。

on のときはトラックが accent なのでつまみとの差が 17:1 あり、分離は要らないが、
滑る途中で影が消えると目立つので両状態とも同じ影を保つ。

### Known Gaps に追加

**1.4.11 Non-text Contrast (AA) — switch の off トラック**

| 対象 | 現在 | 地とのコントラスト | 必要 |
|---|---|---|---|
| off トラック `border-strong` | `#d4d4d6` | 1.42:1 | 3:1 |

塗りなので枠線より厳しいが、input の枠線と濃さが揃うことを優先した。
**つまみが明るいノブとして立つので、状態の判別自体はできる**
（light は影で 1.48:1 を補い、dark は色だけで 7.09:1）。
1.4.11 が本来求めているのは「コントロールの状態と境界が知覚できること」で、
塗りの濃さそのものではない。濃い方に振るなら 1 行で切り替わる。

```css
:root { --kh-switch-track-off: var(--kh-color-fg-muted); }  /* 4.6:1 */
```

### playground にテーマ切り替えを付けた

dark を目で確認する手段が無かったので、React playground の上部に sticky の
トグルを置いた。`data-theme` を `<html>` に付け外しするだけ。
地の色（`--kh-color-canvas`）はページ側の責任なので playground が指定している。
**kohaku は body に何も指定しない。**

## アイコンをどこまで kohaku が持つか（2026-09-22）

checkbox のチェックマークで「同梱しない方針」と衝突した。自己流で決める前に
**CSS-only と Web Components で 1 つずつ、実物のソースを読んだ。**

### Bootstrap が CSS に同梱している SVG（`scss/_variables.scss`・全 16 個）

チェック / 横棒 / 丸（checkbox・indeterminate・radio）、丸 ×3（switch のつまみ）、
▾（select）、▾ ×2（accordion）、‹ ›（carousel）、ハンバーガー ×2（navbar）、
×（close）、チェックと ! （バリデーション表示）。

**Bootstrap Icons（同じ組織の 2000 個のセット）からすら引いていない。**
scss に手で書いた文字列で、`viewBox 0 0 20 20` / `stroke-width 3` と、
Bootstrap Icons とも揃っていない。外部依存ゼロを優先している。

### Shoelace の `system` ライブラリ（全 18 個）

`caret` `check` `chevron-down/left/right` `copy` `eye` `eye-slash` `eyedropper`
`grip-vertical` `indeterminate` `person-fill` `play-fill` `pause-fill` `radio`
`star-fill` `x-lg` `x-circle-fill`

Bootstrap Icons を 1500 個同梱しているのに、そこから独立した system を別に持つ。
ソースのコメントいわく「利用者がアイコンライブラリをどう設定しても、解決に
失敗しても、**常に使えることを保証するため**」。

### 一致した線引き

設計が全く違う 2 つが、ほぼ同じ集合を持っていた。

> **その部品を操作するために要る図形は同梱する。
> 中身を説明するアイコンは同梱しない。**

Alert のアイコンは **Bootstrap も daisyUI も持っていない**（docs が「自分で svg を
書け」と言い、daisyUI は全例が手書き svg）。理由は後付けではなく説明がつく。
チェックマークはどのセットでもほぼ同じ形で 16px、セットが違っても気づかれない。
Alert のアイコンは 24px で目立ち、**セットごとに絵柄が明確に違う**ので、
利用側が Heroicons で揃えている所に Lucide の三角を出すとそこだけ浮く。

Shoelace が同梱できるのは 1500 個 + 差し替え API を持っているから。規模が違う。

### ただし kohaku には当てはまらなかった

上の線引きは「**誰が使うかわからないライブラリ**」の前提で成り立っている。
Alert のアイコンを同梱しない理由は「利用側が別のセットで揃えていると絵柄が割れる」
だが、**kohaku の利用者はあさひ 1 人で、アイコンは Lucide で揃える。**
割れる相手が存在しない。

なので **Alert の 4 つも同梱する**。`info` / `circle-x` / `triangle-alert` /
`circle-check` を variant ごとに割り当て、`<Alert variant="danger" title="…">`
だけでアイコンが出るようにした。`icon` を渡せば `:empty` が外れてそちらが勝つ。
neutral は「中立」なので絵柄を持たない。

**配る相手が増えたらここを見直す。** 外すのは `alert.css` の variant ごとの
`--kh-alert-glyph` を消すだけで、4 行で戻せる。

調べたこと自体は無駄ではなかった。checkbox / select の判断は同梱側で正しかったし、
「なぜ普通は同梱しないのか」を知った上で外れる方が、知らずに外れるより安全。

### kohaku の実装

`tokens.css` に `--kh-glyph-*` として data URI で持つ。絵柄は Lucide から
path だけ写す（Bootstrap は自前で座標を書いているが、kohaku は利用側が
Button / Alert に差す Lucide と線の太さ・端の丸めを揃えたいので同じ出典から取る）。

**`background-image` ではなく `mask` を使う。** Bootstrap は background-image な
ため svg に色を焼き込んでおり、その結果 dark 対応に `--bs-btn-close-filter` で
`invert()` をかけるハックを持つ羽目になっている。mask なら形だけ借りて塗りは
`currentColor` が決めるので、`--kh-color-accent-fg` を上書きすれば追従するし、
dark も 1 つの定義で済む。

使う側は `:empty` で判定する。利用側が `<svg>` を入れたらグリフは引っ込むので、
**差し替えの邪魔をしない。**

```css
[data-part="indicator"]:empty {
  background: currentColor;
  mask: var(--kh-glyph-chevron-down) center / contain no-repeat;
}
```

`item-indicator` は Ark が `hidden` を付けるので `:not([hidden])` で囲う。
**dialog の content で踏んだ罠と同じ。**

### 現状と残り

| 図形 | 状態 |
|---|---|
| check / minus | ✅ checkbox と select の item-indicator で使用 |
| radio の点 | ✅ CSS の `::after` で描画（図形なので data URI すら不要） |
| chevron-down | ✅ select。`▾` という**文字**の直打ちをやめた |
| info / circle-x / triangle-alert / circle-check | ✅ Alert の variant ごと |
| ‹ › / « » | ✅ pagination の前後・最初最後のボタン |
| × | ✅ toast の閉じるボタン |
| eye / star / grip | ⬜ password-input / rating / 並べ替えを作るとき |

React と Vue の両方で `m6 9 6 6 6-6` が出ることを実測した。
**CSS 1 枚で FW を問わず同じ図形が出る**ことの裏付けにもなっている。

## invalid を danger から切り出した（2026-09-22）

input の invalid で、枠線 (#e7000b) とエラー文言 (#9b2421) の色が揃っていなかった。
「そういう仕様か」と聞かれて調べたら、**トークンの使い方を間違えていた。**

### 塗りは反転しなくてよく、線と文字は反転が要る

danger ボタンは light / dark とも「白文字 vs 赤地 = 4.57:1」で変わらない。
**自分で地を作るのでページの地に依存しない。** だから `--kh-color-danger` は
テーマで反転しなくてよかった。

枠線とエラー文言は**ページの地の上に直接**置かれる。地が
`#fafafb` ⇄ `#09090a` と反転する以上、こちらも反転しないと沈む。
エラー文言が `danger-deep`（反転する）だったのは正しく、**枠線が塗り用の
`danger` を使っていたのが間違い**だった。

### danger-deep には相乗りできなかった

「枠線も danger-deep にすれば揃う」では済まなかった。あさひの判断は
「鮮やかな方が読みやすいので、文字を枠線に揃えたい」だったが、
`danger-deep` は **soft 地 (#ffe2dd) の上の文字も兼ねている**。

| light の候補 | canvas の上 | soft 地の上 |
|---|---|---|
| `#9b2421`（当時） | 7.55 ✓ | 6.44 ✓ |
| `#d91c0b` | 4.88 ✓ | 4.17 ✗ |
| `#e7000b` | 4.57 ✓ | 3.90 ✗ |

鮮やかにすると soft 地に近づいて落ちる。**「薄い赤地の上」と「ページの地の上」は
要求が違う。** 1 本では両立しない。

dark は逆に 1 本で足りる（`#ff6055` は canvas 6.69 / surface 5.96 / soft 5.36）。
暗い地同士なので差が開くため。

### CyberAgent (Spindle) も同じ構造だった

`caution color` が light `#d91c0b` / dark `#ff6a59` で切り替わる。
L1 の名前が `Caution Red 100` と `Caution Red **Vivid** 100` で、
**dark 用に別のランプを持っている。** kohaku の L1 / L2 と同じ構造。

暗い地の上で赤を読ませるには明度も彩度も上げる必要がある、という同じ結論に
別々に辿り着いている。実測でも light の `#e7000b` は dark canvas で 4.17:1 しか
出ず AA を落ちる。**赤は 1 つの値で両テーマを賄えない色。**

### 採用

`--kh-color-invalid` を L2 に立てた。danger の 3 段目ではなく**別の役割**として持つ。
danger =「破壊的操作・警告」、invalid =「フォームの検証状態」。

```
light  #e7000b  canvas 4.57:1
dark   #ff6055  canvas 6.69 / surface 5.96   oklch(0.70 0.20 27.3)
```

参照するのは input / checkbox / radio の枠線、invalid のリング、
error-text、required-indicator。**switch の invalid だけはトラックが「塗り」**
なので `danger` のまま残してある。この 1 箇所が線引きをよく表している。

dark の値は Spindle の `#ff6a59` に寄せた。従来の `danger-deep` の dark
(`#ff9f93`) はコントラストを取りすぎて赤さが抜け、サーモンピンクに見えていた。

| | 枠線 | 文言 | 一致 | 地とのコントラスト |
|---|---|---|---|---|
| light | `#e7000b` | `#e7000b` | ✓ | 4.57:1 |
| dark | `#ff6055` | `#ff6055` | ✓ | 6.69:1 |

danger ボタン（塗り）と soft alert の文字（dark で 7.65:1）は無傷。

## checkbox / switch / radio-group の書き味レイヤー（2026-09-22）

CSS が固まったので @kohaku/react に 3 つ足した。見た目のコードは 1 行も入れない。
隠すのは定型だけで、隠した部品は `Checkbox.Control` などで再輸出してある。

```tsx
<Checkbox defaultChecked>メールで通知を受け取る</Checkbox>
<Switch>ゲストの招待を許可する</Switch>
<RadioGroup label="プラン" defaultValue="pro">
  <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
</RadioGroup>
```

`RadioGroup` だけ label を props で受ける。root の中で label と item が
並ぶ構造なので、children に混ぜると位置を間違えられる。

### Ark の React 実装は zag と違うことがある

**checkbox の Indicator は 2 つ要る。** zag の `getIndicatorProps` は
`hidden: !indeterminate && !checked` で、checked でも indeterminate でも
1 つの indicator を出す。ところが Ark の React 側がこれを上書きしている。

```tsx
// @ark-ui/react/checkbox-indicator.tsx
const isVisible = indeterminate ? checkbox.indeterminate : checkbox.checked
```

`indeterminate` prop を付けない Indicator は **indeterminate のとき隠れる**。
1 つで足りると思って書いたら横棒が出なくなった。ラッパーでは両方置いてある。

**zag の anatomy と connect を読んだだけでは足りない。** Ark の各 FW 実装が
振る舞いを足していることがある。DOM は実測で確かめる。

### 出力 DOM が素の Ark と一致することを実測

ラッパー経由の署名を取り、素の Ark で書いたときと同じ構造・同じ属性であることを
確認した（id など Ark が毎回変えるものは除外）。
CSS の当たり方も checked / unchecked / indeterminate / disabled / invalid と
`indicator` を渡した場合まで含めて変わっていない。

## Storybook に 13 個すべて落とした（2026-09-22）

`storybook/` をワークスペースに足した。renderer は `@storybook/react-vite`（v10）。
全 59 story が描画され、型エラーは 0。

テーマはツールバーから `<html data-theme>` を切り替える。地の色は decorator が
当てる（kohaku は body に触らないため）。Storybook の `backgrounds` は
kohaku 自身が canvas を持つので無効にした。二重管理になる。

### story を書いたら実バグが 2 つ出た

**1. `Input` の `size` が HTML の size 属性と衝突していた。**
`ComponentPropsWithoutRef<"input">` には `size?: number`（表示幅）が含まれる。
そこに `& { size?: FieldSize }` を交差させると `number & "sm"` = `never` になり、
**`<Input size="sm" />` が型エラーになっていた。** playground では `size` を
渡していなかったので気づいていなかった。`Omit<..., "size">` で先に落とす。

**2. `@kohaku/react` に `@types/react` が無かった。**
pnpm は厳格なので、他パッケージから型を覗けない。playground が動いていたのは
playground 側に型があったからで、パッケージ単体では型が付いていなかった。

**story は「使う側の型」を通す最初の場所**だった。playground は自分で書いた
呼び出ししか含まないが、story は props を網羅するので当たり方が違う。

### 分類

```
Base/      Button / Badge / Icon
Form/      Field / Input / Checkbox / Switch / RadioGroup / Select
Layout/    Card / Group
Feedback/  Alert
Overlay/   Dialog
```

各コンポーネントに `Default` と、状態を並べた `States`（または `Variants`）を置く。
argTypes は Controls で触れる意味のあるものだけ出す（`indicator` のような
ReactNode は `control: false`）。

### 素の HTML ギャラリーを畳んだ（2026-09-22）

`preview/index.html` と `scripts/dev.mjs` を削除した。Storybook と役割が被るため。

**「Ark 無しで CSS だけが効くか」を確かめる唯一の場所ではあった**が、
FW 非依存の裏付けは `playground/vue` が担っている（同じ CSS で React と Vue が
同じ DOM・同じ見た目になることは実測済み）。素の HTML での確認が必要になったら
そのとき作り直す。git に残っている。

CLAUDE.md の「新しいコンポーネントを作ったら必ずギャラリーに足す」も
「確定したコンポーネントは必ず Storybook に落とす」に書き換えた。

## Alert の actions は文と同じ行の右端に置く（2026-09-23）

文の下で左揃えにしていたのを、右端に移した。あさひの感覚は「ボタンは右」。

他のライブラリは 2 通りに分かれる。**「文の下で右寄せ」はどこもやっていない。**

| 置き方 | 採用 |
|---|---|
| 文の下・左揃え | Polaris / Atlassian / Primer の既定 |
| 文と同じ行の右端 | Carbon / Primer の `inline` |

右に寄せるなら、文の下ではなく**文と同じ行の右端**にする。下に置いて右寄せすると
読み終えた位置からもボタンの位置からも遠い。

### 列は数字で決め打ちしない

以前は `grid-column: 2` だった。icon が無いと Alert は 1 列なので、
**暗黙の 2 列目ができて description がそこへ流れていた**（WithActions の story で発覚）。
今は `grid-column: -2`（最後の列）で、icon の有無どちらでも同じ位置に来る。

### 見送り: 狭い幅で縦に積む

Primer は狭い画面で actions を文の下へ落とす。kohaku はまだやらない。
サイドバーのような狭い場所に actions 付きの Alert を置く場面が出たら、
container query で足す。

## Card の余白は外 16 / 区画の間 12（2026-09-23）

以前は外周も区画の間も 20px だった。本文が 1 行のカードだと中身より余白が勝ち、
縦に間延びして見えた。外 20 / 間 20、外 20 / 間 12、外 16 / 間 12 を
狭い幅（235px）と広い幅（736px）の両方で並べて、外 16 / 間 12 に決めた。
**区画の間を外周より狭くする**と、中身どうしが 1 つのまとまりに見える。

### 区画の間は root の gap で作る

以前は header / body / footer の padding で間を作っていた。そのため
**body を省くと header と footer の間が 0 になっていた**（InLayout の story で発覚）。
root に `gap` と `padding-block` を持たせ、part は `padding-inline` だけにした。

divided の線は、線の上下どちらも gap（12px）になるようにしてある。

## Badge neutral の地を色つき soft と同じ明度にする（2026-09-23）

neutral の地は `surface-muted`（L 0.967）だった。canvas と 1.05:1、白と 1.10:1 しか
差がなく、白と見分けられなかった。色つき soft は L 0.945 で白と 1.16:1 あるので、
**neutral だけ地から浮いていなかった。**

L 0.967 / 0.945 / 0.920 を並べて、0.945 に決めた。色つきの Badge と同じだけ浮く。

`surface-muted` 自体は変えずに、L2 に `--kh-color-neutral-soft` を立てた。
`surface-muted` は input や button など他でも「沈んだ面」として使っていて、
役割が違う。**Badge の地は soft の仲間**なので、soft と明度を揃える。

dark は gray-800（L 0.274）がもともと soft の明度（0.275）と揃っていたので、そのまま。

## Textarea を Input から分けた（2026-09-23）

部品としては最初から `Input` と `Textarea` の 2 つだったが、ファイルと
Storybook が一緒だった。HTML のタグも役割も別なので分けた。

名前は TextField / TextArea にしなかった。他のライブラリで TextField は
**ラベルと補足文まで含んだ部品**を指すことが多く、kohaku ではそれが Ark の `Field`。
`Field` と `TextField` が並ぶと紛らわしい。HTML のタグ名と Ark の part 名
（`input` / `textarea`）に揃える。

CSS は `input.css` に共通の枠・focus・disabled・invalid・size を残し、
複数行だけの指定を `textarea.css` に出した。共通部分まで複製すると、
focus や invalid を直すたびに 2 箇所触ることになる。

### Field.Textarea が 1 行になっていた

複数行の指定が `[data-kh="textarea"]` にしか当たっておらず、**Ark の
`Field.Textarea` は高さ 40px・resize 自由の 1 行**になっていた。
`textarea.css` では Ark の part と `data-kh` の両方に当てている。
実測で 80px / 上下 12px / resize vertical。

## ラベルのルールと、必須の印（2026-09-23）

日本語 5 つ（デジタル庁・SmartHR・Spindle・Ubie・freee）と海外 7 つ
（GOV.UK・Polaris・Carbon・Atlassian・Primer・Spectrum・M3）＋ NN/g を調べた。

### どこも同じだったので、そのまま採る

- placeholder をラベルの代わりにしない
- 必須の印はラベル文字の後ろ
- ラベルは入力欄の上が既定。左置きは作らない（認めるのは Spectrum・Polaris・DADS くらい）
- ラベルの末尾にコロンを付けない（GOV.UK・Carbon・Spectrum が明文で禁止）
- ラベルと入力欄の間は 4〜8px（kohaku は 8px）

### 必須の印は「必須」の文字バッジ、10px

**和文の 5 つはすべて「必須」という文字で書き、`*` だけのものは無かった。**
海外は `*` が多い。和文基準なので文字にした。バッジ（SmartHR・Spindle・Ubie・freee）と
「※必須」テキスト（DADS）を並べてバッジに、12 / 11 / 10px を並べて 10px に決めた。
ラベル（14px）の脇役なので、小さくてよい。

Ark の RequiredIndicator は React でも Vue でも中身に `*` を入れ、`aria-hidden` が付く。
**見た目専用なので CSS の `::before` で描き替えた。** FW を問わず同じに出る
（React / Vue とも 28.7 × 15px を実測）。文言は `--kh-field-required-text` で変える。
読み上げは input の `required` が担う。

色は invalid ではなく danger の soft / deep。**自分で地を作る塗り**だから
（「塗り」と「地の上の線・文字」の線引き）。文字と地は light 6.44 / dark 7.65。

縦位置: 箱の中心はラベルと 0.00px。インクで見るとラベル文字より 0.6px 下だが、
checkbox の −0.18〜+0.60px と同じ幅なので補正しない。

### 補足文は入力欄の下のまま

DADS と GOV.UK はラベルと入力欄の間に置くが、他の大半は下。SmartHR と Spindle は
内容で上下を使い分ける。並べて見て、下のままにした。

### 未決: 任意の印

「どちらに印を付けるか」は完全に割れていた（必須だけ / 任意だけ / 両方 / 少ない方だけ）。
今は必須だけ。任意を示したくなったら Ark の `fallback`（required でないとき描かれる）で
出せるが、fallback は data-part を持たないので CSS で狙う手段を別に考える必要がある。

## ラベルを横に置けるようにした（2026-09-23）

最初は「認めるところが少ない」と作らない判断をしたが、あさひから
「PC 前提の SaaS だと横並びもよくある」と言われて作った。調べた中でも
Spectrum（縦のスペースが限られるとき）、NN/g（非常に長いデスクトップのフォーム）、
DADS が認めている。**kohaku の用途は SaaS なので、ちょうど当てはまる。**

### 使い方は祖先に 1 つ

`data-label-position="side"` を form などの祖先か Field.Root 自身に付ける。
1 項目ずつ指定させると、フォームの中で縦と横が混ざる事故が起きる。
ラベル列の幅は `--kh-field-label-width`（既定 9rem）を祖先で上書きし、
フォーム全体で入力欄の左端を揃える。

Ark の Field.Root に向きの prop は無いので、`data-*` をそのまま流すだけで、
React 側にラッパーは足していない。

### 左寄せ

左寄せと右寄せを並べて左寄せにした。

### ラベルは入力欄の 1 行目と中心を揃える

ラベルに入力欄と同じ高さ（`--kh-field-height`）の箱を持たせ、その中で中央に置く。
textarea は箱の高さを「上下 padding + 1 行 + 枠線 2 本」にして 1 行目に合わせる。
実測で input / textarea とも中心のずれ 0.0px。

補足文とエラーは入力欄の列（2 列目）の下に出る。

### ラベル列は 9rem。バッジは次の行へ送らない（2026-09-23 追記）

最初は 8rem（128px）だったが、「氏名（カタカナ）」＋必須バッジが 131px で入らず、
**和文が 1 文字ずつに潰れ、バッジも「必」「須」と縦に並んだ。** flex の子が
両方とも縮んでいたため。

8 / 9 / 10rem を並べて 9rem（144px）にした。バッジを次の行へ送る案もあったが、
文字が入力欄の中心から 8.5px 上にずれるので却下（「次行には行ってほしくない」）。
今はバッジに `flex-shrink: 0` を付け、入りきらないときは**文字の方が折り返す**。
バッジは文字の右に元の大きさで残る。

### 見送り: 狭い幅で縦に戻す

container query で、幅が足りないときに上置きへ戻すのが筋。
狭い画面で横並びフォームを使う場面が出たら足す。

## Fieldset を入れた（2026-09-23）

氏名を「姓」「名」の 2 欄にしたいという話から。

### 1 つの Field に入力欄を 2 つ入れない

Ark の Field は中の入力欄すべてに**同じ id** を振る（`use-field.js` で確認）。
2 つ入れると id が重複し、ラベルのクリックも読み上げも壊れる。
姓・名は Field を 2 つ作り、Fieldset で「氏名」として束ねる。横に並べるのは Group。

### 姓・名の小ラベルは入力欄の上

小ラベルを上 / 横 を、縦並び・横並びのフォームの両方で並べて、上に決めた。
横に置くと、横並びフォームの中で入力欄が 79px まで細る。
小ラベルは legend より一段下げる（text-sm / 400 / fg-muted）。

### 横並びフォームの中の Fieldset

legend を左の列に立て、中の Field は横にしない（`field.css` の横並びの
セレクタに `:not([data-scope="fieldset"] *)` を足した）。

**描画上の legend は fieldset の枠に特別扱いで置かれ、grid に参加しない。**
`float: left` を付けると普通の子に戻り、grid に載る。legend は小ラベルの高さ分
下げて、姓・名の入力欄と中心を揃えている（実測 0.0px）。

### Ark の Fieldset がやらないこと

- **invalid は中の Field に伝わらない。** 赤くしたい Field に invalid を付ける
- **disabled は中の入力欄まで効く**（素の fieldset の disabled）が、中の Field は
  それを知らないので、ラベルを薄くするのは fieldset.css が持つ

### story は国内のよくあるフォームを再現する

氏名は姓・名に見える小ラベルを付けず、placeholder（「姓」「名」「セイ」「メイ」）で
示す。住所は「郵便番号・都道府県・市区町村 / 町名・番地 / 建物名・部屋番号」の 3 行。

「placeholder をラベルの代わりにしない」はどこも一致した原則だが、姓・名の欄は
legend（氏名）が問いを示していて、placeholder は「どちらの欄か」を補うだけ。
**入力すると消えるので、読み上げ用の名前は `aria-label` で別に持たせる。**
国内のフォームで最も見慣れた形なので、story はこれに合わせた（あさひの判断）。

行を分けるときは Group を縦に重ねる。行の間は `fieldset.css` が 12px 空ける。

### 必須バッジは「問い全体」か「項目ごと」か

氏名は「氏名」の legend に 1 つ、住所は郵便番号・都道府県など中のラベルごとに付ける
（あさひの判断）。氏名は姓・名の片方だけ必須ということが無く、住所は建物名だけ任意になる。

Field.RequiredIndicator は Field の外では動かない（Ark の field context は
strict: false で、外では `undefined.required` を読んで落ちる）。legend は
**`<Fieldset.Legend data-required>` を付けると CSS がバッジを描く。**
見た目は field.css の `::before` と同じ宣言を共有している（10px / 高さ 15px / 文字から 8px）。
読み上げ用には中の Field それぞれに required を付ける。

## 年齢・生年月日・数値の入力と Affix（2026-09-23）

日本語 5 つ（DADS・SmartHR・Spindle・Ubie・freee）と海外 6 つ
（GOV.UK・Polaris・Carbon・Atlassian・Primer・Spectrum）＋ NN/g・Ark を調べた。

### どこも同じだったので、そのまま採る

- **生年月日にカレンダーを使わない。** DADS「カレンダーボタンを置くべきではありません」。
  カレンダーは近い日付向け（NN/g「1 年以内」）
- **年齢に＋－ボタン（NumberInput）を使わない。** NN/g が age / date of birth を名指し。
  NumberInput は人数・数量のように小さく増減する値向け
- 欄の幅は桁数に合わせ、年を月・日より広くする（DADS 72 / 56px をそのまま採用）
- 3 欄の間でフォーカスを自動で移さない（DADS・Spindle・GOV.UK）
- 年は西暦で持つ。和暦は添えるだけ

### `type="number"` は使わない

`inputMode="numeric"` の普通の入力欄にする。Ubie（E 表記を受け入れる）・GOV.UK
（ホイールで値が変わる、音声入力で入らない）・Spectrum・DADS が同じ。
Ark の NumberInput も中身は text + `role="spinbutton"`。Polaris・Carbon・Primer は
使うので割れてはいるが、使う側も SmartHR のようにホイールを殺す処理を足している。

### 生年月日は年・月・日の 3 欄。セレクトにしない

DADS・Ubie・GOV.UK が 3 つの入力欄。セレクト 3 つ（freee）は DADS と NN/g が
退けている（何十年も遡るのに選択肢が長すぎる、a11y 上の問題）。
あさひの判断も「欄は分けたい」。

### 単位は枠の外（Affix）

「年」「歳」を枠の内側に置く（SmartHR・Polaris・Primer）か外（GOV.UK・Ubie・freee）かは
割れていた。あさひの判断で**外**。`<Affix>` を Group の中で入力欄の隣に置く。

- 読み上げには出さない（`aria-hidden`）。GOV.UK「Do not rely on prefixes or suffixes alone」。
  意味は入力欄のラベルか `aria-label`（年・月・日）で持たせる
- 入力欄と同じ高さの箱の中で中央に置き、入力欄と同じ光学補正（`--kh-field-optical-shift`）を
  入れる。Group は Field を含むと上揃えになるので、エラーで Field が伸びても単位は動かない。
  インクの中心は入力欄の数字と sm −0.13 / md 0.00 / lg 0.00px
- 単位は前の欄に寄せる。欄 → 単位は 8px、単位 → 次の欄は 16px（Ubie と同じ考え方）
- 文字の大きさは Group の size（`--kh-field-font-size`）に従う

## 2026-10-31 レイヤーと reset — 既存プロダクトに後から入れる

会社の既存 Vue（自前 reset + グローバル SCSS）と、Tailwind ありの新規 React の両方に
入れる前提で見直した。どれも「新しい CSS を既存のページに後から入れる」ときに起きる問題で、
kohaku 特有ではない。

### `utilities` をレイヤー宣言から外した

層の並びは**最初に名前が出た順**で決まる。Tailwind v4 は先頭で
`@layer theme, base, components, utilities;` を宣言するので、その後に kohaku を読むと
`utilities` は登録済みで、kohaku はその後ろに並ぶ。結果、kohaku が utility に勝って
`class="h-12"` が効かなかった（実測 40px、期待 48px）。

他人の層の名前を kohaku が宣言しても、並びは読み込み順に負けるので意味がない。外して、
Tailwind と併用するときは利用側が `@import "@kohaku/styles" layer(components)` で
読み込む形にした（実測 48px）。

### 既存のグローバル CSS は層に閉じ込めてもらう

レイヤーの外の CSS は全レイヤーに勝つ。「利用側が必ず勝つ」の裏返しで、既存アプリの
`.legacy button { height: 20px }` が kohaku の Button を壊した（実測 20px・角丸 0）。
既存 CSS を `@layer legacy` に入れて kohaku より手前に並べれば壊れない（実測 40px）。
dart-sass なら `@include meta.load-css()` を `@layer` で包むだけで済む。

### 部品は reset に頼らない（`components/base.css`）

既存プロダクトに kohaku の reset を入れると、kohaku と関係ない画面まで行間（1.75）や
フォントが変わる。だから既存側では reset を入れない。そのとき部品が崩れないよう、
部品が reset から受け取っていたもの（box-sizing、文字組み）を部品自身に持たせた。

- 全部 `:where()` で詳細度 0。各部品の CSS が必ず勝つ
- 内側の部品は `font: inherit` などを明示する。button / input はブラウザ既定で継承が切れ、
  既存 CSS の `* { font-family }` は継承より強いため
- 起点の部品（kohaku の部品の中にいないもの）で kohaku の文字組みを始める。
  Portal で body 直下に飛んだ部品もここに当たる
- **文字色は持たない。** 地の色と同じくページ側の責任。持たせると、周りの文字色を
  受け継いでいた部品（Checkbox のラベルなど）が黒くなった

意地悪な既存 CSS（`* { font-family: serif; box-sizing: content-box }`、
`button, input { font-size: 13px }`）の下でも、部品の値は reset ありと全部一致した。
base.css が無いと Button と Input が 4px 膨らみ、Input は明朝になる。

副作用で、Alert の字送りが 0.32px → 0.28px になった。`0.02em` を body（16px）で計算した
値を受け継いでいたのが、Alert 自身の 14px で計算されるようになったため。こちらが正しい。

既存プロダクト用に reset 抜きの入口 `@kohaku/styles/components` を足した。既存の reset を
消して kohaku の reset に替えればいい、とはならない。既存の reset（Meyer 系：余白 0・リストの点を消す）と
kohaku の reset（行間・フォント）はやることが違い、古い画面の scoped CSS は既存の reset を前提にしている。
入れ替えは画面単位で進むので、その間は既存の reset のまま部品だけ入れる。全部終わったら切り替える。

### reset.css を本来の意味に戻し、base.css を分けた

それまでの `reset.css` は、ブラウザ既定を消すものではなく、body に kohaku の文字組みを
**足す**もの（一般には base と呼ぶ）だった。ブラウザ既定を消していたのは box-sizing と
フォーム部品のフォント継承だけ。名前と中身がずれていたので分けた。

- `reset.css` = 消すだけ。値は足さない
- `base.css` = kohaku の文字組みと地の色を body に広げる

トークン（`tokens.css`）と base を同じファイルにしないのは、トークンは既存プロダクトにも
必ず読ませるから。変数の宣言は画面を変えないが、`body { line-height }` は変える。

reset は「困るものだけ消す」流派にした。部品は見た目を全部自分で持つので、見出しの大きさまで
消す流派（Meyer・destyle）にする理由がない。Tailwind の preflight とも重なりが少ない方がいい。
Tailwind v4 preflight / Josh Comeau / Andy Bell / kiso.css を読み、複数が揃って消しているものを採った。

- 採った: box-sizing、余白（body・見出し・p・リストなど）、リストの点とインデント、リンクの色、
  画像を block + 親幅まで、フォーム部品のフォント継承、fieldset の枠と余白、placeholder の薄さ、
  表の border-collapse、iOS の文字サイズ自動調整
- リストの点は `list-style-type: ""` で消す。`none` だと Safari がリストとして読み上げなくなる（kiso と同じ）
- 採らなかった: 見出しの大きさ・太さ（preflight だけが消す）、リンクの下線（Andy Bell・kiso は残すか
  リンクだけ戻す。リンクだと分かることを優先）、ボタンの背景・角丸（部品が持つ）
- 全部 `:where()` で詳細度 0。疑似要素は `:where()` に入れられないので外に出した

playground・Storybook は余白をインライン指定しているので、入れ替えても見た目の差分は 0 だった。

## 2026-10-31 Tabs

### 下線（line）にした。箱（contained）にしない

調べたら 2 系統に分かれていた。下線は SmartHR・Primer・Carbon の line、箱は DADS
（クリアフォルダのインデックス）・Carbon の contained。playground に並べて、あさひの判断で line。

- 業務 SaaS では line が主流
- 「影より先に線、線より先に余白」の順に合う。contained は線が多く、Card の中に置くと箱が二重になる。
  Carbon も「モーダルのような部品の中では line」としている
- 同じものの状態の切り替え・絞り込みには Tabs を使わない（SmartHR・Primer は Segmented Control に分けている。
  DADS も絞り込みはフォーム部品で、としている）

### 選択中の印は trigger 自身の下線。Ark の indicator は使わない

indicator は JS が位置（`--left` / `--width`）を計算するので、Ark を使わない素の HTML では出ない。
trigger の `border-bottom` なら CSS だけで済む。動く下線のアニメーションは捨てた。

### list の線は border ではなく背景で描く

入りきらないときは横にスクロールさせたい（Carbon・SmartHR と同じ。折り返さない）。
`overflow-x: auto` は border の手前で切り取るので、list の border に trigger の下線を
重ねると、重ねた 1px が消えた（実測: 下端 1px が list 側になっていた）。
list の線を `linear-gradient` の背景で内側に描き、trigger は重ねずに並べると、下線 2px が全部見える。

### 上にも透明な 2px の線を置く

下線の分だけ内容の箱が上に寄り、文字が 1px 上にずれる。`border-block` で上下に同じ太さを置いた。
同じ文字（「あとで」）で ghost Button と比べて、インク中心のずれは両方 0.00px。

### 高さは 40px（Button・Input の md と同じ）

Carbon の line も Medium 40px。サイズの段は作っていない（YAGNI）。L3 の `--kh-tabs-height` で寄せられる。

## 2026-10-31 Tooltip

### 白地に線だけ。影なし・矢印なし

反転（黒地。Primer・Carbon・shadcn）と白地（SmartHR）を並べて、あさひの判断で白地。
最初は白地に `--kh-shadow-md` を付けたが「ぼんやりして気持ち悪い」。12px のぼかしが輪郭を
ぼかしていた。線だけ / 線＋`--kh-shadow-sm` を並べて、線だけにした。

- 影より先に線、の順にも合う
- dark では `--kh-shadow-sm` が外側の 1px の線になり、枠線と二重になる
- dark は地（gray-950）の上に一段明るい面（gray-900）と線（gray-800）で分かれる

矢印は付けていない（Primer も無し）。

### interactive の既定を true にした（`@kohaku/react` だけ）

Ark の既定（false）は positioner に `pointer-events: none` を付け、Tooltip の上にポインタを
移すと閉じる。WCAG 1.4.13（ホバーで出た内容の上に移れる）を満たさない。kohaku は AA が目標なので
Root の既定を変えた。Ark を直接使う場合（Vue など）は自分で `interactive` を付ける。
Esc で閉じることは Ark がやる（実測）。

### 和文の光学補正を padding で入れた

行間 1.5 で組むと、同じ文字（「あとで」）でインクの中心が -1.5px 上に出た（13px）。
上の padding を `--kh-tooltip-optical-shift`（0.115em）足して下を同じだけ引き、高さを変えずに下げた。
補正後 -0.5px。Tooltip の高さが 29.5px で中央が画素の境目に来るので、これ以上は 1px 単位の丸めの範囲。

### z-index は content に書く（Select の不具合も直した）

Ark は content の computed z-index を読んで、positioner のインライン style
（`z-index: var(--z-index)`）に写す。positioner に書いた z-index はインラインに負けて `auto` になっていた。
Select も同じで、選択肢が sticky なヘッダー（z-index 10）の下に潜る状態だった。両方 content に移した。

## 2026-10-31 Popover

### Select の選択肢と同じ面（線＋shadow-lg）

線だけ（Tooltip と同じ）と並べて、こちらにした。Tooltip は読むだけの面なので線で足りるが、
Popover と Select は下の画面に重なったまま操作する面で、浮いていることが分かった方が迷わない
（「影は浮いていることを示すときだけ」の場面）。あさひの判断は「今は見た目より動くこと」。
影のぼかし（32px）が強すぎる件は、Select・Dialog と合わせて後で見直す余地がある。

閉じるボタンは付けていない。Esc と外のクリックで閉じる（Ark の既定）。
React / Vue とも、開く・中のチェックボックス・Esc・外クリック・フォーカスが trigger に戻る、を実測した。

## 2026-10-31 Collapsible

trigger は素のテキストボタン（枠なし）、indicator は Select と同じシェブロン（空なら kohaku が描く）。
開閉は Ark が content に入れる `--height` を keyframes で使う。`prefers-reduced-motion` では止める。
React / Vue とも、クリック・Space・Enter での開閉、`aria-expanded`、閉じたときの `hidden` を実測した。
開閉できる Card は Card の中に Collapsible を置けば組める。専用の部品は作っていない（YAGNI）。

## 2026-10-31 Progress

線形だけ。track は `--kh-color-neutral-soft`、range は accent、高さ 6px・角丸 full。
値が無いときは短い帯が流れる。`prefers-reduced-motion` では帯を全幅に薄く敷いて止める。

### progressbar の名前を label に結び付ける（`@kohaku/react`）

Ark は `role="progressbar"` を Track に付け、`aria-label` を値の文字列（"40%"）にする。
読み上げが「40%、プログレスバー」になり、何の進み具合か分からない。ラッパーで Track に
`aria-labelledby` を付けて label を指すようにした。label が無いときは Root の `aria-label` を Track に移す。
Ark を直接使う場合（Vue）は自分で付ける（playground/vue に書き方がある）。

## 2026-10-31 Vue での確認をやり直した

Tabs〜Collapsible で「React / Vue で一致」と書いたが、止めたつもりの開発サーバーが残っていて
5175 番で React の playground が動いており、Vue を測れていなかった（ページのタイトルで気づいた）。
サーバーを止めて本物の Vue で 5 つとも測り直し、動作・見た目の値が一致することを確認した。
再発しないよう、playground の dev に `--strictPort` を付けた（番号が埋まっていたらずれずに止まる）。

## 2026-10-31 Pagination

項目は ghost の Button、現在のページは solid の Button と同じ塗り。36px の正方形（Button の sm と同じ段）で、
桁が増えたら横に伸びる。端の前後ボタンは消さずに薄くする。消すと押す位置がずれるため。

矢印は前後ボタンが空のときに CSS が描く（`--kh-glyph-chevron-*`）。省略の「…」も空のときに
`content: "…" / ""` で描き、読み上げからは外す。どちらも Vue で何も書かずに出る。

### ラベルを日本語にする（`@kohaku/react`）

Ark の既定は "next page" / "page 3" のような英語で、読み上げがそのまま英語になる。ラッパーで
`translations` の既定を日本語にした。Ark を直接使う場合（Vue）は自分で渡す（playground/vue に書き方がある）。
Progress の aria-labelledby と同じく、Vue 版の書き味レイヤーを考えるときの材料。

### `type="link"` は `<a>` にする

Ark は `type="link"` でも既定で `<button>` に href を付けるだけなので、ラッパーで `asChild` の `<a>` にした。
端のボタンは href が外れ、フォーカスも当たらなくなる（実測）。

## 2026-10-31 Toast

面は Popover と同じ（白地＋線＋影）。画面に重なって浮くので影を使う。種類のアイコンは Alert と同じ
絵柄と色。Toast には icon の part が無いので root の `::before` に描く。**info は Ark の既定の種類**なので、
Alert の neutral と同じくアイコンを持たない（付けると普通の通知すべてに「i」が付く）。
loading は線の輪を回す（Spinner を作るときに揃える）。

位置・重なり・積み上げは Ark が root に入れる `--x` / `--y` / `--scale` などを使う（Ark の推奨 CSS のまま）。

### 列の間は gap ではなく margin で作る

列は icon / 文 / action / 閉じる。アイコンや action が無いときも列は残るので、`column-gap` だと
幅 0 の列の分だけ文が右に 12px ずれた（実測）。各要素の margin で間を作るようにした。

### 名前を日本語にする（`@kohaku/react`）

Ark の既定は group が "Notifications, bottom-end (altKey+T)"、閉じるボタンが "Dismiss notification"。
`<Toaster>` で「通知」「通知を閉じる」にした。閉じるボタンの名前は toast ごとの `translations` でしか
変えられないので、要素に `aria-label` を直接渡して上書きしている。Vue は自分で書く（playground/vue）。

## 2026-10-31 File Upload

ドロップ領域は破線の枠（「ここに置ける」の慣習）。ファイルを持ってきている間は実線の濃い線と薄い地にして
「受け取れる」を示す。label は Field の label と同じ見た目（field.css に並べた）。一覧の各行は
Toast と同じ列の作り方（無い列で文がずれないよう margin で間を作る）、削除ボタンも Toast の閉じると同じ。

### ドロップ領域をボタンにしない（`@kohaku/react`）

Ark の dropzone は既定で `role="button"` と `tabindex="0"` を持ち、領域ごとクリックで選択画面が開く。
その中に「ファイルを選択」ボタンを置くと**操作できる要素の入れ子**になり、読み上げで中のボタンに
届かない（axe の nested-interactive）。dropzone に `disableClick` と `role="group"` を付け、
ドロップを受けるだけにした。選ぶ操作はボタンに一本化。押せる見た目（cursor・hover）は
`[role="button"]` のときだけ付くので、Ark の既定のまま使う人にも矛盾しない。

### 却下されたファイルを黙って消さない

`maxFileSize` や `accept` に合わないファイルは Ark の `rejectedFiles` に入るだけで、何もしないと
消えたように見える。一覧に invalid の色で並べ、理由を日本語で出す（`formatError` で差し替えられる）。

### 大きさの表記

Ark は Intl の単位で "70 byte" / "2.05 kB" と出す。`ja-JP` でも "byte" のまま。Windows の
エクスプローラーと同じ 1024 区切り・KB / MB にした（業務の利用者がいちばん見慣れている）。

### ドロップは手で確かめる

合成イベントのドロップではファイルが入らない（ブラウザが合成ファイルからエントリを読めない）。
ドロップはあさひが手で確認した。ドラッグ中の見た目（`data-dragging`）は実測。
Playwright の MCP はファイル選択画面を横取りするので、そのブラウザでは「ファイルを選択」が
反応しないように見える（`browser_file_upload` で処理するまで止まっている）。

## 2026-10-31 @kohaku/vue を作った

会社の既存 Vue に入れるため。これまで Vue は Ark を直接使っていて、`@kohaku/react` が足している
a11y の既定（Tooltip の interactive、Progress の aria-labelledby、FileUpload の入れ子回避）と
日本語の文言（Pagination / Toast / FileUpload）を毎回自分で書く必要があった。
上の各項目にある「Vue は自分で書く（playground/vue）」は、ここで `@kohaku/vue` に置き換わった。

### 形

`@kohaku/react` と同じ名前・同じ組み立て（`Dialog.Content` は Teleport / Backdrop / Positioner を隠す、など）。
SFC で書き、kohaku が足す props だけを宣言する。残りは Vue の attrs のフォールスルーで Ark に流れる
（React の `{...props}` に当たる）。ReactNode を受けていた props（label / title / icon など）は
文字列の props と同名の slot の両方で受ける。

### Vue で踏んだもの

- **`<Checkbox default-checked>` が効かない。** Ark Vue の checked は `boolean | "indeterminate"` なので、
  値を書かない属性（`""`）が true に変換されない。ラッパーで `[Boolean, String]` として宣言し直した。
  素の Ark Vue でも同じことが起きる
- **その結果 `v-model:checked` が届かなくなった。** Vue は、自分が props として宣言した名前の
  `onUpdate:*` を下へ流さない（宣言した側が v-model を扱うとみなす）。`update:checked` を受けて emit し直した
- **Progress の track の `aria-label`。** Vue は `undefined` を明示すると Ark が付けた属性ごと消す。
  React と同じ DOM にするため、渡す属性そのものを分けた
- **vue-tsc は TypeScript 7 で動かない**（TS 5 系の内部 API を使う）。`@kohaku/vue` と playground/vue だけ TS 5.9

### 一致の確かめ方

playground/vue を React の playground と同じ内容にして、画面の全要素（265 個）の
タグ・data-*・role・aria-*・文字・大きさを突き合わせた。違いは見出しの文言（Portal → Teleport）だけ。
動き（ページ送り・開閉・キー操作・Tooltip の上に移っても閉じない・Toast の action と閉じる・
ファイルの選択と削除）も同じ操作を流して一致。`v-model` は Checkbox / Switch / RadioGroup /
Pagination / Input で両方向を確かめた（Vue だけの欄を playground の末尾に置いてある）。

## 2026-10-31 Pagination / Toast / File Upload を dark で測った

崩れは無し。文字は light / dark とも 4.5:1 以上（最小は light の Pagination の番号 4.6:1）。
3:1 を下回ったものは、どれも既存の判断の範囲にあるので直していない。

| 対象 | light / dark | 扱い |
|---|---|---|
| Pagination の端の前後ボタン（薄くしたもの） | 1.94 / 2.65 | 押せない部品は 1.4.11 の対象外 |
| ドロップ領域の破線 `border-strong` | 1.48 / 1.69 | input の枠線と同じ Known Gap。`--kh-color-border-strong` の 1 行で一緒に切り替わる |
| Toast の枠線 `border` | 1.22 / 1.33 | card・popover と同じ Known Gap。浮く面は影でも分かれる |
| Toast の warning アイコン | 2.14 / 8.27 | 意味は見出しの文字が持ち、アイコンは補助（1.4.11 は理解に必要な図形が対象）。Alert の warning と同じ |

## 2026-11-11 実アプリを置く場所を作った（examples/saas）

会社への導入が走り出したので、ここからは自分のプロダクトとして見た目を詰める段階に入った。
ただ「16px が良いか」は机の上では決まらない。公開されている DS の決め方を調べたら、
GOV.UK は部品を 1 つ足すのに「複数のチームで役に立つ証拠（動いているサービスのスクショやリンク）」を
要求していて、月 1 の working group が判定しているのは **useful か / unique か** だけだった。
美醜の合議はしていない。SmartHR も「ルールは妥当な意思決定を早めるための補助線であって法律ではない」
「小さくルールを作り、当てはまらない場合があればより妥当なルールに見直す」と言っている。

つまり決定の根拠は**使用実績**。kohaku にはそれが 1 つも無かった（利用者 1 人・実プロダクト 0 個）ので、
判断の基準が作れず値を触れない状態だった。そこで実アプリを置く場所を作った。

```
playground      部品を並べる作業台（比較セクションを足す・消す）
examples/saas   kohaku だけで組んだ実アプリ。壊れたところが部品を足す根拠になる
storybook       確定したものの置き場
```

### 題材

経費申請の承認画面（一覧 + 絞り込み + 一括操作 + 詳細）。業務 SaaS でいちばん出てくる形で、
Table / Badge / Select / Dialog / Pagination / Checkbox / Toast / Tooltip が一度に出る。
`pnpm dev:saas`（5176）。

### app.css は 2 つに分けてある

- **A. kohaku に無いので自分で書いた分** — ここに書かざるを得なかったものが roadmap の根拠
- **B. この画面固有のレイアウト** — kohaku に入れてはいけないもの

この線引きを CSS の中に残しておくと、あとで「どっちだったか」を思い出さずに済む。

### 1 枚組んで分かったこと（部品を足す根拠）

- **Table** は見た目だけでも毎回同じものを書く（行の高さ・罫線・`thead` の地・金額の右揃えと
  `tabular-nums`・hover・選択行の地）。並べ替えを TanStack に任せても、この分は残る
- **sr-only** と **Breadcrumbs**（区切りの `/` 含む）は毎回書き写すことになる
- **Link** は `--kh-color-link` というトークンがあるのに部品が無い。表の中のリンクに
  focus ring と `tabular-nums` を自分で付けた
- **Stack / Cluster** が無いので、B 側のほぼ全部が flex の直書きになった
- **Date Picker** が無いので期間の絞り込みが素の `input[type=date]` のまま。業務 SaaS の一覧に
  期間指定はほぼ必ず要るので、roadmap の順番としては妥当

## 2026-11-11 IconButton を足した（examples/saas で出た最初の穴）

経費画面の検索ボタンを虫眼鏡にしたら、**48×40 の横長**になった。アイコン 1 個でも横 padding が
文字用のままだったため。業務 SaaS の一覧には必ずアイコンだけのボタンが出るので kohaku が持つ。

### 別部品ではなく `data-icon` にした

Primer / Forma 36 / Gestalt は IconButton を別部品として立てている。kohaku は本体が CSS なので、
別部品にすると variant / size / state の CSS が二重になる。`[data-kh="button"][data-icon]` に
すると全部そのまま継承する。幅は `var(--kh-button-height)` を見るので、祖先で高さを寄せても
正方形のまま付いてくる（Group の `--kh-button-height` が効く）。

書き味レイヤー（React / Vue 両方）には `IconButton` を置き、**`label` を必須の prop にした**。
アイコンしか無いと読み上げが「ボタン」になる。SmartHR も「ラベルテキストがないため、アイコンには
必ず代替テキストを含めてください」と書いている。文言は Primer の言う通り**操作の名前**で、
絵柄の名前ではない（虫眼鏡なら「拡大」ではなく「探す」）。Tooltip は添えられるが既定では出さない
（Primer は既定で出す。kohaku は選択肢を奪わない方針なので利用側が決める）。

### 実測で 2 つ直した

- **和文の光学補正が邪魔だった。** Button の中のアイコンには `--kh-icon-optical-shift`
  （和文の ink box に合わせる 0.072em）が入っているが、隣に文字が無いと **0.5px 上にずれるだけ**。
  `[data-icon]` では `margin-bottom: 0` にした。補正は「文字と並ぶとき」の話だったと分かった
- **Group の中で潰れた。** 40px のはずが **36.92px**（入力欄に押されていた）。`flex: none` を足した。
  正方形が崩れたら意味が無い

直したあと、React / Vue の両 playground で 9 要素すべて 28/36/40/44 の正方形・dx dy = 0 を実測。
DOM も一致。

### 角丸は Button と同じにし、L3 で逃がす

並べて比べて（8px / 円形 / 6px）、**既定は 8px**（文字のボタンと揃う）。ツールバーの ghost などで
円にしたくなることはあるが、それは既定ではなく個別調整なので L3 に逃がす。
Button の角丸が `var(--kh-radius)` の直書きだったのを `var(--kh-button-radius, var(--kh-radius))`
に変えた。Tailwind 併用なら `rounded-full` でも勝つ（利用側は layer の外）。

### 利用側が Lucide を使うときの穴（2026-11-11）

examples/saas のアイコンを手書きの path から **lucide-react** に替えた。kohaku はアイコンを
同梱しない方針なので、利用側がライブラリを入れるのが正しい形（手書きは絵柄が崩れる）。

ただし `@kohaku/react` の `Icon` は **children にパスを書く前提**だったので、Lucide の
コンポーネント（自分で `<svg>` を出す）をそのまま通せなかった。最初は `data-kh="icon"` を
手で付ける定数を書いたが、Lucide 前提なら毎回これなので **`Icon` に `asChild` を足した**。

```tsx
<Icon asChild><Search /></Icon>
```

kohaku は `data-kh="icon"` / `data-size` / `aria-hidden` を足すだけで、幾何（viewBox・stroke）には
触らない。Lucide の既定は kohaku が期待するものと同じ（viewBox 24 / stroke-width 2 / round /
currentColor）なので、CSS のサイズ指定が svg の width/height 属性に勝ってそのまま収まる。
入れ子の `<svg>` は作らない（実測 0 個）。

Vue 側は vnode を複製する必要があるので、`Icon.vue` だけ template ではなく **render 関数**で
書き直した（`cloneVNode`）。slot の最初の要素ノードを拾う。React / Vue で属性も大きさも一致を実測。

## 2026-11-11 タイプスケールを 12 / 14 / 16 / 24 にした（freee と同じ形）

examples/saas のサイドバーの文字が小さいと言われ、測ったら 13px（`--kh-text-sm`）だった。
`<small>` がさらに 0.83 倍して 10.83px になっている所もあった。原因を追うと、
スケール 13 / 14 / 16 / 18 そのものに 2 つ問題があった。

- **13 と 14 が見分けられない。** 使い分けの基準が作れないので、どちらを使うかが場当たりになる
- **上の段が低い。** h1（18）と h2（16）の差が 2px で、ページ見出しが立たない

### 何を参考にしたか

最初はデジタル庁と SmartHR を見た（どちらも 16px 基準。SmartHR は 14px を非推奨にして 16px に上げている）。
ただ、この 2 つは「誰でも読めること」を最優先した DS で、文字が大きくなる方向にしか振れない。
kohaku は見た目の洗練も捨てたくないので、それだけを根拠にしなかった。

freee Vibes の Storybook を Playwright で開いて、部品ごとに実測した（描画されたことも確認した。
最初の 1 回は story が描画に失敗していて、Storybook 自身の見出しを測っていた。測る前に描画を確かめる）。

| freee | 大きさ |
|---|---|
| PageTitle / ダイアログのタイトル | 24px / 700 |
| SectionTitle | 16px / 700 |
| SubSectionTitle | 14px / 700（本文と同じ大きさ。太さで見出しにする） |
| 本文・表のセル | 14px |
| 注釈・フォームのラベル・表頭 | 12px |
| Button 24 / 36 / 48px | 12 / 14 / 16px |
| TextField 24 / 36px | 12 / 14px |

Text 部品のサイズは 12 / 14 / 16 / 24 の 4 つだけ。

### 決めたこと

- 値: **12 / 14 / 16 / 24**。下は 2px 刻み、ページ見出しだけ 1.5 倍に跳ぶ
- **操作する部品の文字は高さで決める**（freee と同じ規則）: 28px → 12 / 36・40px → 14 / 44px → 16。
  これまで 36px の Button・Input・Group・Pagination と、File Upload・Toast のボタンは 13px（sm）だったのを 14px（md）にした
- 補助の文字（ヘルプ・エラー・Tooltip・Badge・Fieldset のラベル・Progress の値）は 12px（sm）のまま
- 見出しの階層は大きさと太さの両方で作る。h3 は本文と同じ 14px の太字
- Dialog のタイトルは xl をそのまま使い、24px になる（freee の TaskDialog と同じ）

Tooltip と Badge は 13 → 12px になったので、文字の縦の位置を測り直した。どちらも −0.5px で、
1 倍の画像で測れる限界（半ピクセル）の範囲内。補正は em で書いてあるので、文字サイズに合わせて縮んでいる。

## 2026-11-11 Checkbox をチェックすると周りがガタつく（vertical-align）

examples/saas の表で行を選ぶと、表全体が上下に動いた。原因は 2 つあった。

1. **Checkbox のベースラインが中身で変わる。** root は `inline-flex` で、既定の `vertical-align: baseline`
   で行に乗っている。inline-flex のベースラインは最初の子から取られるが、印（✓ / −）が `hidden` だと
   拾えるものが無く**箱の下端**になり、印が見えると**印の位置**になる。チェックした瞬間に箱が上下にずれ、
   表頭の行が 48.5 → 45.5px に縮んだ。表のセルに限らず、文の中に置いた Checkbox でも起きる。
   root に `vertical-align: middle` を付けた。中身に左右されない
2. **一括操作の行が後から伸びる**（examples 側）。選択すると `size="sm"` のボタン（36px）が出るが、
   行の最低の高さが 32px だったので 4px 押し広げられた。最初から 36px 取っておく

直したあと、1 行選ぶ / 2 行選ぶ / 表頭で全選択 / 全解除 の 4 操作で、一括操作の行・表頭・各行・
各チェックボックスの位置がどれも 0px しか動かないことを実測。ラベル付きの Checkbox は
✓ / 空 / − のどれでも箱とラベルの縦の中心が一致（ずれ 0）。
RadioGroup は印を常に描いているので起きない（切り替えても項目の高さ・間隔・全体の高さは不変）。

## 2026-11-11 Table（行の高さは padding でなく高さで決める）

examples/saas の一覧は 1 行 70.5px あった。内訳は 上下 padding 12 + 12、2 段のセル（名前と部署）が
行間 1.75 で 24.5 × 2 = 45.5、罫線 1。2 段のセルが無くても 48.5、sm ボタン（36px）だけでも 60 になる。

### 調べたこと

既定の行の高さは 36〜48px に集まる（SmartHR・freee 40 / Carbon・MFUI 48 / shadcn 36 / Primer 36）。
行政系だけ広い（デジタル庁 67 / GOV.UK 45）。決め方は 2 系統あった。

- padding + 行間で決まる: SmartHR / shadcn / Primer
- 行の高さを固定（min-height）: freee（tr に 2.5rem）/ Carbon（xs〜xl）/ MFUI

表の中で行間を詰めるかは日本語 DS でも割れる（freee 1 / SmartHR 1.5 / デジタル庁 1.7、密な版だけ 1.3）。

### 決めたこと

- **行の高さは固定する（48px、表頭 40px）。** `td` の `height` は min-height として効くので、
  2 段のセル・チェックボックス・ボタンのどれが来ても全行がそろう。padding で決める案（56px）と
  40px 固定の案を実際と同じ 8 列の表で縦に並べて比べ、48px にした
- セルの行間は `--kh-leading-ui`（1.5）。本文の 1.75 を持ち込むと 2 段のセルで行が伸びる
- **行ごとの操作はボタンを並べず「…」1 つにまとめる。** 「内容を見る」と「承認」を並べた形は
  行ごとにボタンの有無が変わって落ち着かなかった。メニューの中身は未着手（examples ではいまは詳細を開く）
- 中身は素の `<table>`。`div[data-kh="table"]` で包む（`border-collapse` の表には角丸が効かないため）。
  TanStack などで包む div を自分で持つときは `data-kh="table"` を付ければ同じ見た目になる
- 列は `data-numeric`（右揃え・等幅数字）と `data-fit`（中身の幅まで縮める）、行は `data-selected`
- 選択用のチェックボックスだけのセルは `:has()` で拾って縮め、右の padding を消す（毎回書かせない）
- 高さは `--kh-table-row-height` / `--kh-table-head-height` で祖先から寄せられる（40px にしたい画面用）

### fg-muted を少し濃くした

表頭（`surface-muted` の地）と、ホバー・選択中の行（`accent-subtle` の地）で補助文字が 4.36:1 になり、
AA（4.5:1）を割っていた。白の上では 4.8 あるが、1 段沈んだ地の上で落ちる。表頭の地を消す・
表頭の文字だけ濃くする案は行のほうが直らないので、`--kh-gray-500` を L 0.552 → 0.540 にした
（使っているのは fg-muted だけ）。沈んだ地の上で 4.62、白の上で 5.08。dark は元から 5.7 以上。

## 2026-11-11 Menu（表の行の「…」）

Table で行ごとの操作を「…」1 つにまとめたので、その中身として Ark の Menu に見た目を付けた。

- **面と項目は Select のドロップダウンにそろえた。** どちらも「押すと浮いて出る項目の一覧」で、
  同じ画面に並んで出る。項目の高さ（40.5px）・ホバーの地・角丸・影が違うと別物に見える
- 書き味レイヤーは Popover と同じで、Portal / Positioner を隠すだけ（`RawContent` で外せる）
- 足した見た目は item / separator だけ。グループの見出し・チェック付きの項目・サブメニュー・
  危険な操作の色は、要る画面が出てから足す
- 表の中では `placement: "bottom-end"` で、トリガーの右端にそろえて開く（右端の列なので、
  左にそろえると表の外にはみ出す）

React / Vue で DOM（違いは自動で振られる id だけ）・項目の高さ・幅が一致。
キーボード（↓ で移動・Enter で選択・閉じたらトリガーにフォーカスが戻る）も確認した。
light / dark とも文字は 4.5:1 以上。無効の項目（2.3〜2.6:1）は WCAG の対象外。

## 2026-11-11 Date Picker

### 調べてから決めたこと（日本語の DS に合わせた）

SmartHR / freee / デジタル庁 / MF / Park UI / shadcn / Atlassian / Carbon を見た。

- **週は日曜始まり。** SmartHR・freee・デジタル庁が日曜（MF だけ月曜）。Ark の既定も日曜
- **土日に色を付けない。** 日本語の DS 4 つとも、ピッカーでは付けていない（freee も大きな予定表でだけ付ける）
- **前後の月の日付は出さない。** 日本語の DS は 4 つ中 3 つが出さない。週の並びを崩さないよう場所は残す
- **選んだ日は塗り、今日は線。** 今日まで塗ると選んだ日と見分けられない（塗っているのは shadcn だけ）
- 見出しは「2026年11月」（ja-JP の既定がそのまま出る）。和暦は持たない

### 比較して決めたこと

日付のマスの形を 円（SmartHR・デジタル庁）/ 角丸の正方形（Park・shadcn）/ 罫線のマス目（freee・MF）で
並べ、**角丸の正方形**にした。Button・Select の項目と同じ形でそろう。1 マス 36px、カレンダー全体で 278px。

### 作りの判断

- 範囲の帯は td に、選んだ日の塗りと今日の線は中のボタンに持たせる。同じ要素に持たせると、
  今日が範囲の中にあるとき今日の角丸で帯が欠ける。端の日の td は半分だけ塗って四角とつなぐ
- 入力欄は Input と同じ枠を control が持ち、範囲なら 1 つの枠に input を 2 つ並べて「〜」でつなぐ（MF と同じ）。
  カレンダーを開くボタンは枠の中。アイコンは「部品を操作するために要る図形」なので `--kh-glyph-calendar` で同梱
- カレンダーは入力欄より広い（278px）ので、中央でなく左端にそろえて開く（`bottom-start`）
- 書き味レイヤーは入力欄・日／月／年の 3 つの表を組み立てて隠す（Pagination と同じ）。素の部品と
  `DatePicker.Calendar`（表だけ）を再輸出する
- 読み上げの文言を日本語にした（Ark の既定は "Choose …" "Switch to next month"）。今日には「今日、」を付ける

React / Vue で DOM（開いた状態で 172 要素）が一致。手入力（「2026/12/5」→「2026/12/05」）、
月・年への切り替えも確認。light / dark とも文字は 4.5:1 以上。期限の外の日（2.3〜2.6:1）は無効なので対象外。

### 範囲の「〜」と日付の縦の位置（実測して直した。4 往復かかった）

「〜がズレて見える」「日付が下に見える」「今度は上に見える」「〜と数字がずれてる」と 4 回言われた。

- **横: 入力欄が中身より広かった。** 6.5em（91px）に対して日付は 80.8px で、「〜」の左右の空きが
  18px / 6px だった。幅を 5.85em（空のときの yyyy/mm/dd 81.5px が収まる）にして 9px / 6px。
  残る 3px は開始日が「1」で終わるため（等幅の「1」は字の左右が空く）で、「…/03 〜 …/13」では 7 / 7
- **縦: 和文の補正が数字に逆向きに効いていた。** 入力欄は `--kh-field-optical-shift` で文字を 1px 下げるが、
  数字のインクはもともとベースライン寄り。日付の入力欄では和文の補正を使わない
- **測り方を 2 回まちがえた。** (1) 1 倍で「/」込みで測っていた。「/」はベースラインの下まで伸びるので
  数字の中心を 1px 低く見積もる。数字（2026）だけを 4 倍で測る。(2) 画像の上端を基準にしていた。
  要素の位置の端数で画像に 1px の余白が入ることがある。**枠線の上端を基準にする**
- **入力欄の中の文字は、ページ上の位置の端数しだいで 1px 上下する**（2 倍・4 倍とも）。入力欄の外に置いた
  「〜」は文字でも図形でも動かないので、場所によって数字とだけずれる。control に `will-change: transform` を
  付けて 1 枚のレイヤーにすると、どの位置でも数字と「〜」が同じ基準で描かれ、差 0 になった
- 「〜」は文字のまま。和文の「〜」は全角の箱の中央に描かれ、数字のインクより 1.5px 上に出るので 0.1em 下げる。
  （図形で描き直す案は形が変わって却下された。フォントの字形を変えない）

結果（2 倍、枠線基準、枠の中心 20.0）: 数字 21.0 / 〜 21.0 / 隣の Select の和文 20.5。examples と playground で同じ。
数字は和文より 0.5px 低いが、「下に見える」（約 2px 低い）と「上に見える」（0.1em 持ち上げ）の間にある。

数字だけが入る欄は和文の補正と逆になる。金額など数字専用の Input を作るときも同じことが起きるはず。

## 色を freee の指定カラーに差し替えた（2026-11-12）

kohaku の利用者はあさひ 1 人なので、「ブランド色を持たない・無彩色」をやめて、freee の指定カラー
（brand.freee.co.jp）をそのまま使うことにした。自前で色を組んで測り直すより確実で早い。

### パレットと割り当ての出どころ

- **ブランドサイトのパレット = L1。** P1〜10（青）、S1〜10（少し赤みのあるグレー）、GY（無彩色）、
  accent 7 色 × 5 段（2/4/5/7/10）。段の番号は freee と同じにした（P5 = `--kh-blue-5`）。元の表と突き合わせやすい
- **Vibes（プロダクトの DS）の割り当て = L2。** Vibes に別のパレットがあるわけではなく、「プロダクトの色は
  ブランドカラーから選ぶ」と書いてあり、役割だけ決めている: 現在地・成功 P5 / リンク・ボタン P7 /
  エラー・削除 RE5 / 注意 YE7（文字は YE10）/ 本文 GY7 / 薄い文字 S9 / 囲みの地 S1
- トークン名に freee は入れない。repo が public なので。Terms で縛っているのはロゴ・イラストの素材で、色コードではない

### Vibes が決めていないところ（kohaku が決めた）

- 枠線 S4 / input の枠 S5（前の無彩色と同じ濃さの段）。選んだ行・範囲の帯 P1
- 沈んだ面は S2。S3 だと fg-muted（S9）が 4.29:1 で AA を割る
- **成功は緑（GR7）のまま。** Vibes は成功を P5 で表すが、kohaku は info も青なので見分けがつかなくなる。
  塗りを GR5 にすると白文字が 3.87:1 なので GR7
- status は soft = 2、line = 4、deep = 7〜10。freee の accent は 2/4/5/7/10 しかないので、前の
  oklch で作った中間の明度は持たない。**パレットに無い色を作らない**
- **dark は freee に無いので同じパレットの暗い段で組んだ。** 地 GY10 / 面 GY7 / 沈んだ面 S10。
  accent は P7 が沈むので P4 に上げ、文字を GY10 にする（6.79:1）。status は soft = 10、line = 7、
  deep = 2（10 の上で 5.45〜9.69:1）。invalid は RE5 が GY10 の上で 3.39:1 なので RE4（6.12 / 4.71）

左右に並べて（左が前の無彩色、右が freee）、light / dark を見て決めた。


### 中身の地を白に、脇の地を S1 にした（同日）

examples で中身の地を S1 にすると、白い表と並んで地が濁って「気持ち悪い」と言われた。
中身の地 / サイドバーの組み合わせを並べた: S1・白 / 全部白 / GY1・白 / 白・S1。
あさひの候補は「全部白」か「サイドバーだけ色」。

サイドバーの色は S1 / S3 / P1 / P10 / GY10 を並べ、P10・GY10・S1 は dark も並べた。

- 青（P1・P10）は無し（あさひ）
- **GY10 は使わない。** freee の Don't に「背景に Primary・Secondary 以外を使う」があり、GY は Accent 側。
  dark では中身の地（GY10）と同じ色になって消えるので、結局 GY7 に逃がすことになり S1 の dark と同じになる
- S3 はサイドバーの補足の文字（S9）が 4.29:1 で割れる

→ `--kh-color-canvas` を白にし、脇の地として `--kh-color-canvas-muted`（S1）を L2 に足した。
サイドバーは kohaku の部品ではないが、利用側が L1 を直接触らなくて済むよう L2 に置く。
dark には中身より沈んだ段が無い（GY10 が一番暗い）ので、面と同じ GY7 にして明るさで分ける（1.30:1）。
