/* component CSS に生の色が直書きされていないかを見る。コメント内は除外。 */
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const DIR = "packages/styles/src/components"
const RE = /(oklch\(|oklab\(|rgba?\(|hsla?\(|#[0-9a-fA-F]{3,8}\b)/g
let bad = 0

for (const f of readdirSync(DIR).filter((f) => f.endsWith(".css"))) {
  const src = readFileSync(join(DIR, f), "utf8")
  // ブロックコメントを同じ長さの空白に置き換えて行番号を保つ
  const stripped = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
  stripped.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(RE)) {
      console.error(`✗ ${DIR}/${f}:${i + 1}  ${m[0]}  ← トークンを使ってください`)
      bad++
    }
  })
}

if (bad) {
  console.error(`\n${bad} 件。色は src/tokens.css に定義し、component からは var() で参照します。`)
  process.exit(1)
}
console.log("✓ component CSS に生の色なし")
