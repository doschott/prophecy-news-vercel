import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  ssl: 'require',
  idle_timeout: 20,
  connect_timeout: 10,
})

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

  try {
    const rows = await sql`
      SELECT articles, total_articles, critical_count, last_updated
      FROM prophecy_data
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (rows.length === 0) {
      return res.status(200).json(DEFAULT_DATA)
    }

    const row = rows[0]
    const data = {
      articles: row.articles,
      lastUpdated: row.last_updated,
      totalArticles: row.total_articles,
      criticalCount: row.critical_count
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Data read error:', error)
    return res.status(500).json({ error: 'Failed to read data' })
  }
}
