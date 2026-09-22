import { decodePNG } from "./png.mjs"
const img = decodePNG(process.argv[2])
const M = Number(process.argv[3] ?? 4)   // 枠線を避けるマージン
const THRESH = 150
const rows = []
for (let y = 0; y < img.h; y++) {
  let n = 0
  for (let x = M; x < img.w - M; x++) if (img.lum(x, y) < THRESH) n++
  rows.push(n)
}
const inked = rows.map((n, y) => [n, y]).filter(([n]) => n > 0).map(([, y]) => y)
const top = inked[0], bot = inked[inked.length - 1]
const inkCenter = (top + bot) / 2
const boxCenter = (img.h - 1) / 2
console.log(`画像       ${img.w} x ${img.h}px  (device pixels)`)
console.log(`インク行   ${top} 〜 ${bot}   高さ ${bot - top + 1}px`)
console.log(`インク中心 ${inkCenter.toFixed(2)}`)
console.log(`枠の中心   ${boxCenter.toFixed(2)}`)
console.log(`ずれ       ${(inkCenter - boxCenter).toFixed(2)}px  (＋なら文字が下寄り)`)
console.log("\n行ごとのインク量:")
rows.forEach((n, y) => { if (n > 0) console.log(String(y).padStart(3), "█".repeat(Math.min(60, n))) })
