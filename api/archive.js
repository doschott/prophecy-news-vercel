import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

// Trust level mapping
const TRUST_LEVELS = ['trusted', 'reliable', 'questionable', 'unreliable']

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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const client = await pool.connect()

  try {
    await initTable(client)

    // Parse query parameters
    const {
      search = '',
      startDate,
      endDate,
      trustLevel,
      minRelevance,
      page = 1,
      limit = 20
    } = req.query

    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20))
    const offset = (pageNum - 1) * limitNum

    // Fetch all articles to filter them
    const result = await client.query(
      `SELECT articles, total_articles, critical_count, last_updated
       FROM prophecy_data
       ORDER BY created_at DESC
       LIMIT 1`
    )

    if (result.rows.length === 0) {
      return res.status(200).json({
        articles: [],
        total: 0,
        page: pageNum,
        totalPages: 0
      })
    }

    const row = result.rows[0]
    let articles = row.articles || []

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase()
      articles = articles.filter(article => {
        const title = (article.title || '').toLowerCase()
        const content = (article.content || '').toLowerCase()
        const summary = (article.summary || '').toLowerCase()
        const source = (article.source || '').toLowerCase()
        return title.includes(searchLower) ||
               content.includes(searchLower) ||
               summary.includes(searchLower) ||
               source.includes(searchLower)
      })
    }

    if (startDate) {
      const start = new Date(startDate)
      articles = articles.filter(article => {
        const published = article.published ? new Date(article.published) : null
        return published && published >= start
      })
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      articles = articles.filter(article => {
        const published = article.published ? new Date(article.published) : null
        return published && published <= end
      })
    }

    if (trustLevel && TRUST_LEVELS.includes(trustLevel.toLowerCase())) {
      const trustLevelLower = trustLevel.toLowerCase()
      articles = articles.filter(article => {
        const articleTrust = (article.trust_level || '').toLowerCase()
        return articleTrust === trustLevelLower
      })
    }

    if (minRelevance) {
      const minScore = parseFloat(minRelevance)
      if (!isNaN(minScore)) {
        articles = articles.filter(article => {
          const score = article.relevance_score || article.score || 0
          return score >= minScore
        })
      }
    }

    // Sort by published date (newest first)
    articles.sort((a, b) => {
      const dateA = a.published ? new Date(a.published) : new Date(0)
      const dateB = b.published ? new Date(b.published) : new Date(0)
      return dateB - dateA
    })

    // Paginate
    const total = articles.length
    const totalPages = Math.ceil(total / limitNum)
    const paginatedArticles = articles.slice(offset, offset + limitNum)

    return res.status(200).json({
      articles: paginatedArticles,
      total,
      page: pageNum,
      totalPages,
      limit: limitNum
    })
  } catch (error) {
    console.error('Archive API error:', error)
    return res.status(500).json({ error: 'Failed to fetch archive data' })
  } finally {
    client.release()
  }
}