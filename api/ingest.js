import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  ssl: 'require',
  idle_timeout: 20,
  connect_timeout: 10,
})

// Initialize table
async function initTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS prophecy_data (
        id SERIAL PRIMARY KEY,
        articles JSONB NOT NULL,
        total_articles INTEGER NOT NULL,
        critical_count INTEGER NOT NULL,
        last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
  } catch (error) {
    console.error('Init table error:', error)
  }
}

initTable()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { articles, totalArticles, criticalCount } = req.body

    if (!Array.isArray(articles)) {
      return res.status(400).json({ error: 'articles must be an array' })
    }

    // Clear old data and insert new
    await sql`DELETE FROM prophecy_data`
    
    const rows = await sql`
      INSERT INTO prophecy_data (articles, total_articles, critical_count, last_updated)
      VALUES (${JSON.stringify(articles)}, ${totalArticles || articles.length}, ${criticalCount || 0}, NOW())
      RETURNING *
    `

    return res.status(200).json({
      success: true,
      message: 'Data ingested successfully',
      articleCount: articles.length
    })
  } catch (error) {
    console.error('Ingest error:', error)
    return res.status(500).json({ error: 'Failed to ingest data', details: error.message })
  }
}
