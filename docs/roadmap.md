# 作るコンポーネント

業務 SaaS の画面を kohaku だけで組めるようにするために、まだ足りない部品。
上から順に作る。作り終えたら行を消して `docs/ark-components.md` の対応状況に移す。

## Ark にある → CSS を当てる

| 部品 | Ark | 重さ | メモ |
|---|---|---|---|
| Pagination | pagination | 中 | |
| Toast | toast | 中 | |
| File Upload | file-upload | 中 | |
| Date Picker | date-picker | 重 | 月・年の切り替えまで要る。入力欄 + カレンダー |

## Ark に無い → kohaku が持つ

振る舞いを持たない見た目・レイアウトの箱。

| 部品 | メモ |
|---|---|
| Table | 振る舞い（並べ替えなど）は TanStack Table などに任せ、kohaku は見た目だけ |
| Breadcrumbs | |
| Link | |
| Spinner | |
| Stack / Cluster | 縦積み・横並びのレイアウト |
| 閉じるボタン付き Badge | 今の Badge に足す |
| `sr-only` | 読み上げ専用テキスト。CSS のユーティリティで済む |
