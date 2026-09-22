import { readFileSync } from "node:fs"
import { inflateSync } from "node:zlib"

export function decodePNG(path) {
  const buf = readFileSync(path)
  let off = 8, w = 0, h = 0, depth = 0, color = 0
  const idat = []
  while (off < buf.length) {
    const len = buf.readUInt32BE(off)
    const type = buf.toString("ascii", off + 4, off + 8)
    const data = buf.subarray(off + 8, off + 8 + len)
    if (type === "IHDR") {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4)
      depth = data[8]; color = data[9]
      if (depth !== 8) throw new Error("bitDepth " + depth + " 未対応")
      if (data[12] !== 0) throw new Error("interlaced 未対応")
    } else if (type === "IDAT") idat.push(data)
    else if (type === "IEND") break
    off += 12 + len
  }
  const bpp = { 0: 1, 2: 3, 4: 2, 6: 4 }[color]
  const raw = inflateSync(Buffer.concat(idat))
  const stride = w * bpp
  const out = Buffer.alloc(h * stride)
  const paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
  }
  for (let y = 0; y < h; y++) {
    const ft = raw[y * (stride + 1)]
    const src = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride)
    const cur = out.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride)
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0
      let v = src[i]
      if (ft === 1) v += a; else if (ft === 2) v += b
      else if (ft === 3) v += (a + b) >> 1; else if (ft === 4) v += paeth(a, b, c)
      cur[i] = v & 0xff
    }
  }
  return { w, h, bpp, px: out, lum: (x, y) => {
    const i = y * stride + x * bpp
    return bpp >= 3 ? 0.299 * out[i] + 0.587 * out[i + 1] + 0.114 * out[i + 2] : out[i]
  } }
}
