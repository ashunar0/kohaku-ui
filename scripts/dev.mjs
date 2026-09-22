/* 依存ゼロの開発サーバ。静的配信 + ファイル変更で自動リロード */
import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { watch } from "node:fs"
import { extname, join, normalize } from "node:path"

const ROOT = process.cwd()
const PORT = Number(process.env.PORT ?? 5173)
const TYPES = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript",
  ".mjs":"text/javascript", ".json":"application/json", ".svg":"image/svg+xml" }

const clients = new Set()
const RELOAD = `<script>
new EventSource("/__reload").onmessage = () => location.reload()
</script>`

createServer(async (req, res) => {
  if (req.url === "/__reload") {
    res.writeHead(200, { "Content-Type":"text/event-stream", "Cache-Control":"no-cache", Connection:"keep-alive" })
    res.write("\n"); clients.add(res); req.on("close", () => clients.delete(res)); return
  }
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname)
  if (p === "/") p = "/preview/index.html"
  const file = join(ROOT, normalize(p))
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return }
  try {
    await stat(file)
    let body = await readFile(file)
    const type = TYPES[extname(file)] ?? "application/octet-stream"
    if (type === "text/html") body = Buffer.from(body.toString().replace("</body>", RELOAD + "</body>"))
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" }).end(body)
  } catch { res.writeHead(404).end("not found") }
}).listen(PORT, () => console.log(`kohaku dev → http://localhost:${PORT}`))

let t
for (const dir of ["packages/styles/src", "preview"]) {
  watch(join(ROOT, dir), { recursive: true }, () => {
    clearTimeout(t)
    t = setTimeout(() => { for (const c of clients) c.write("data: reload\n\n") }, 60)
  })
}
