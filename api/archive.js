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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const client = await pool.connect()

  try {
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

    // Build WHERE clause based on filters
    const conditions = []
    const params = []
    let paramCount = 0

    if (search) {
      paramCount++
      conditions.push(`(title ILIKE $${paramCount} OR summary ILIKE $${paramCount} OR content ILIKE $${paramCount} OR source ILIKE $${paramCount})`)
      params.push(`%${search}%`)
    }

    if (startDate) {
      paramCount++
      conditions.push(`published_at >= $${paramCount}`)
      params.push(startDate)
    }

    if (endDate) {
      paramCount++
      conditions.push(`published_at <= $${paramCount}`)
      params.push(endDate + 'T23:59:59.999Z')
    }

    if (trustLevel && TRUST_LEVELS.includes(trustLevel.toLowerCase())) {
      paramCount++
      conditions.push(`LOWER(trust_level) = $${paramCount}`)
      params.push(trustLevel.toLowerCase())
    }

    if (minRelevance) {
      paramCount++
      conditions.push(`relevance_score >= $${paramCount}`)
      params.push(parseFloat(minRelevance))
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM prophecy_articles ${whereClause}`
    const countResult = await client.query(countQuery, params)
    const total = parseInt(countResult.rows[0].total)

    // Get paginated articles
    const dataQuery = `
      SELECT 
        article_id, id, title, content, summary, source, source_url,
        author, published_at, collected_at, image_url, relevance_score,
        trust_score, trust_level, critical
      FROM prophecy_articles
      ${whereClause}
      ORDER BY published_at DESC NULLS LAST
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `
    params.push(limitNum, offset)

    const dataResult = await client.query(dataQuery, params)

    const articles = dataResult.rows.map(row => ({
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
      trust_score: row.trust_score,
      trust_level: row.trust_level,
      critical: row.critical === 1
    }))

    const totalPages = Math.ceil(total / limitNum)

    return res.status(200).json({
      articles,
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
