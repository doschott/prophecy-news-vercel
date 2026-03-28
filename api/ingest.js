import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

async function initTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS prophecy_data (
      id SERIAL PRIMARY KEY,
      articles JSONB NOT NULL,
      total_articles INTEGER NOT NULL,
      critical_count INTEGER NOT NULL,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const client = await pool.connect()
  
  try {
    const { articles, totalArticles, criticalCount } = req.body

    if (!Array.isArray(articles)) {
      return res.status(400).json({ error: 'articles must be an array' })
    }

    // Ensure table exists
    await initTable(client)
    
    // Clear old data and insert new
    await client.query('DELETE FROM prophecy_data')
    
    const result = await client.query(
      `INSERT INTO prophecy_data (articles, total_articles, critical_count, last_updated)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [JSON.stringify(articles), totalArticles || articles.length, criticalCount || 0]
    )

    return res.status(200).json({
      success: true,
      message: 'Data ingested successfully',
      articleCount: articles.length
    })
  } catch (error) {
    console.error('Ingest error:', error)
    return res.status(500).json({ error: 'Failed to ingest data', details: error.message })
  } finally {
    client.release()
  }
}
