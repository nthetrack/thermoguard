import { createServer } from 'http'
import { readFile } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST = join(__dirname, 'dist')
const PORT = 3333

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

async function serve(req, res) {
  let url = new URL(req.url, `http://localhost:${PORT}`).pathname
  if (url === '/') url = '/index.html'

  const filePath = join(DIST, url)
  const ext = extname(filePath)

  try {
    const data = await readFile(filePath)
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000' })
    res.end(data)
  } catch {
    // SPA fallback: serve index.html for all non-file routes
    try {
      const index = await readFile(join(DIST, 'index.html'))
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' })
      res.end(index)
    } catch {
      res.writeHead(404)
      res.end('Not found')
    }
  }
}

createServer(serve).listen(PORT, () => {
  console.log(`ThermoGuard static server running on http://localhost:${PORT}`)
})
