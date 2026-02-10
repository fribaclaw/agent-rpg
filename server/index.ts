import express from 'express'
import cors from 'cors'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const app = express()
const PORT = 3001
const WORKSPACE = '/Users/fribaclaw/.openclaw/workspace'
const ALLOWED = ['SOUL.md', 'MEMORY.md', 'AGENTS.md', 'IDENTITY.md', 'USER.md', 'TOOLS.md']

app.use(cors({ origin: /localhost/ }))
app.use(express.json())

app.get('/api/config/:file', async (req, res) => {
  const file = req.params.file
  if (!ALLOWED.includes(file)) return res.status(403).json({ error: 'Forbidden' })
  try {
    const content = await readFile(join(WORKSPACE, file), 'utf-8')
    res.json({ content })
  } catch {
    res.json({ content: '' })
  }
})

app.put('/api/config/:file', async (req, res) => {
  const file = req.params.file
  if (!ALLOWED.includes(file)) return res.status(403).json({ error: 'Forbidden' })
  try {
    await writeFile(join(WORKSPACE, file), req.body.content, 'utf-8')
    res.json({ ok: true })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(PORT, () => console.log(`Config API on :${PORT}`))
