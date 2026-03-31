import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

// Default sample data
const DEFAULT_DATA = {
  articles: [
    {
      title: "Major Earthquake Strikes Middle East Region",
      source_url: "https://example.com/earthquake",
      source: "Reuters",
      published_at: new Date().toISOString(),
      summary: "A significant earthquake has been reported in a key Middle Eastern location, raising concerns among prophetic watchers.",
      relevance_score: 0.85,
      critical: true
    },
    {
      title: "Global Currency Reset Discussions Continue",
      source_url: "https://example.com/currency",
      source: "Financial Times",
      published_at: new Date(Date.now() - 3600000).toISOString(),
      summary: "World economic leaders discuss potential changes to global monetary systems.",
      relevance_score: 0.72,
      critical: false
    },
    {
      title: "Tensions Rise in Eastern Europe",
      source_url: "https://example.com/ukraine",
      source: "BBC News",
      published_at: new Date(Date.now() - 7200000).toISOString(),
      summary: "Ongoing geopolitical tensions show no signs of resolution as diplomatic efforts stall.",
      relevance_score: 0.78,
      critical: true
    }
  ],
  lastUpdated: new Date().toISOString(),
  totalArticles: 3,
  criticalCount: 2
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const client = await pool.connect()
  const { search, days = 30 } = req.query
  
  try {
    // Check if articles table has any data
    const countResult = await client.query(
      `SELECT COUNT(*) as cnt FROM prophecy_articles`
    )

    if (parseInt(countResult.rows[0].cnt) === 0) {
      return res.status(200).json(DEFAULT_DATA)
    }

    // Build query based on filters
    let query
    let params = []
    const daysNum = parseInt(days, 10) || 30
    
    if (search) {
      // Search mode: search in title, summary, source
      const searchLower = search.toLowerCase()
      query = `
        SELECT article_id, id, title, content, summary, source, source_url,
               author, published_at, collected_at, image_url, relevance_score,
               is_prophecy_related, trust_score, trust_level, critical
        FROM prophecy_articles
        WHERE (title ILIKE $1 OR summary ILIKE $1 OR source ILIKE $1)
        ORDER BY published_at DESC NULLS LAST, relevance_score DESC
        LIMIT 200
      `
      params = [`%${search}%`]
    } else {
      // Date filter mode
      query = `
        SELECT article_id, id, title, content, summary, source, source_url,
               author, published_at, collected_at, image_url, relevance_score,
               is_prophecy_related, trust_score, trust_level, critical
        FROM prophecy_articles
        WHERE published_at >= NOW() - INTERVAL '${daysNum} days'
        ORDER BY published_at DESC NULLS LAST, relevance_score DESC
        LIMIT 200
      `
    }

    const result = await client.query(query, params)
    
    // Get metadata
    const metaResult = await client.query(`
      SELECT total_articles, critical_count, last_updated 
      FROM prophecy_meta 
      ORDER BY id DESC 
      LIMIT 1
    `)

    const articles = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      summary: row.summary,
      source: row.source,
      source_url: row.source_url,
      author: row.author,
      published_at: row.published_at,
      collected_at: row.collected_at,
      image_url: row.image_url,
      relevance_score: row.relevance_score,
      is_prophecy_related: row.is_prophecy_related === 1,
      trust_score: row.trust_score,
      trust_level: row.trust_level,
      critical: row.critical === 1
    }))

    const meta = metaResult.rows[0] || { total_articles: articles.length, critical_count: 0, last_updated: new Date() }

    const data = {
      articles: articles,
      lastUpdated: meta.last_updated,
      totalArticles: parseInt(meta.total_articles),
      criticalCount: parseInt(meta.critical_count)
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Data read error:', error)
    return res.status(500).json({ error: 'Failed to read data' })
  } finally {
    client.release()
  }
}
