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

// Default sample data
const DEFAULT_DATA = {
  articles: [
    {
      title: "Major Earthquake Strikes Middle East Region",
      url: "https://example.com/earthquake",
      source: "Reuters",
      published: new Date().toISOString(),
      summary: "A significant earthquake has been reported in a key Middle Eastern location, raising concerns among prophetic watchers.",
      score: 85,
      critical: true,
      categories: ["natural-events", "middle-east"]
    },
    {
      title: "Global Currency Reset Discussions Continue",
      url: "https://example.com/currency",
      source: "Financial Times",
      published: new Date(Date.now() - 3600000).toISOString(),
      summary: "World economic leaders discuss potential changes to global monetary systems.",
      score: 72,
      critical: false,
      categories: ["economy", "global"]
    },
    {
      title: "Tensions Rise in Eastern Europe",
      url: "https://example.com/ukraine",
      source: "BBC News",
      published: new Date(Date.now() - 7200000).toISOString(),
      summary: "Ongoing geopolitical tensions show no signs of resolution as diplomatic efforts stall.",
      score: 78,
      critical: true,
      categories: ["geopolitics", "europe"]
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
  const { search, days = 7 } = req.query // Default 7 days for dashboard
  
  try {
    // Ensure table exists
    await initTable(client)
    
    const result = await client.query(
      `SELECT articles, total_articles, critical_count, last_updated
       FROM prophecy_data
       ORDER BY created_at DESC
       LIMIT 1`
    )

    if (result.rows.length === 0) {
      return res.status(200).json(DEFAULT_DATA)
    }

    const row = result.rows[0]
    let articles = row.articles || []
    
    // Filter to past N days if no search (search mode bypasses date filter)
    if (!search) {
      const daysNum = parseInt(days, 10) || 7
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - daysNum)
      articles = articles.filter(a => new Date(a.published_at) >= cutoff)
    } else {
      // Search mode: filter by search term (case-insensitive)
      const searchLower = search.toLowerCase()
      articles = articles.filter(a => 
        (a.title && a.title.toLowerCase().includes(searchLower)) ||
        (a.summary && a.summary.toLowerCase().includes(searchLower)) ||
        (a.source && a.source.toLowerCase().includes(searchLower))
      )
    }
    
    // Sort by date (most recent first), then by relevance score
    articles.sort((a, b) => {
      const dateA = new Date(a.published_at || 0)
      const dateB = new Date(b.published_at || 0)
      return dateB - dateA
    })

    const data = {
      articles: articles,
      lastUpdated: row.last_updated,
      totalArticles: row.total_articles,
      criticalCount: row.critical_count
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Data read error:', error)
    return res.status(500).json({ error: 'Failed to read data' })
  } finally {
    client.release()
  }
}
