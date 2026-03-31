import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

async function initArticlesTable(client) {
  // Store individual articles for accumulation
  await client.query(`
    CREATE TABLE IF NOT EXISTS prophecy_articles (
      article_id INTEGER PRIMARY KEY,
      id INTEGER,
      title TEXT,
      content TEXT,
      summary TEXT,
      source TEXT,
      source_url TEXT,
      author TEXT,
      published_at TIMESTAMPTZ,
      collected_at TIMESTAMPTZ,
      image_url TEXT,
      relevance_score REAL,
      is_prophecy_related INTEGER,
      trust_score REAL,
      trust_level TEXT,
      critical INTEGER,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  
  // Create index on published_at for date filtering
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_articles_published 
    ON prophecy_articles (published_at DESC)
  `)
}

async function initMetaTable(client) {
  // Metadata table for totals
  await client.query(`
    CREATE TABLE IF NOT EXISTS prophecy_meta (
      id SERIAL PRIMARY KEY,
      total_articles INTEGER NOT NULL DEFAULT 0,
      critical_count INTEGER NOT NULL DEFAULT 0,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export default async function handler(req, res) {
  const client = await pool.connect()
  
  try {
    // POST method - ingest articles or delete
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { articles, totalArticles, criticalCount, action, articleId } = req.body

    // Handle delete action
    if (action === 'delete' && articleId) {
      await client.query('DELETE FROM prophecy_articles WHERE article_id = $1', [parseInt(articleId)])
      return res.status(200).json({ success: true, message: `Article ${articleId} deleted` })
    }

    if (articles !== undefined) {
      if (!Array.isArray(articles)) {
        return res.status(400).json({ error: 'articles must be an array' })
      }

      await client.query('BEGIN')
      
      await initArticlesTable(client)
      await initMetaTable(client)

      // Upsert each article individually
      for (const article of articles) {
        await client.query(`
          INSERT INTO prophecy_articles (
            article_id, id, title, content, summary, source, source_url,
            author, published_at, collected_at, image_url, relevance_score,
            is_prophecy_related, trust_score, trust_level, critical, last_updated
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
          ON CONFLICT (article_id) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            summary = EXCLUDED.summary,
            source = EXCLUDED.source,
            source_url = EXCLUDED.source_url,
            author = EXCLUDED.author,
            published_at = EXCLUDED.published_at,
            collected_at = EXCLUDED.collected_at,
            image_url = EXCLUDED.image_url,
            relevance_score = EXCLUDED.relevance_score,
            is_prophecy_related = EXCLUDED.is_prophecy_related,
            trust_score = EXCLUDED.trust_score,
            trust_level = EXCLUDED.trust_level,
            critical = EXCLUDED.critical,
            last_updated = NOW()
        `, [
          article.id,
          article.id,
          article.title,
          article.content,
          article.summary,
          article.source,
          article.source_url,
          article.author,
          article.published_at,
          article.collected_at,
          article.image_url,
          article.relevance_score,
          article.is_prophecy_related ? 1 : 0,
          article.trust_score,
          article.trust_level,
          article.critical ? 1 : 0
        ])
      }

      // Update metadata
      await client.query(`
        INSERT INTO prophecy_meta (total_articles, critical_count, last_updated)
        VALUES ($1, $2, NOW())
      `, [totalArticles || articles.length, criticalCount || 0])

      await client.query('COMMIT')
    }

    return res.status(200).json({
      success: true,
      message: 'Data ingested successfully'
    })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Ingest error:', error)
    return res.status(500).json({ error: 'Failed to ingest data', details: error.message })
  } finally {
    client.release()
  }
}
