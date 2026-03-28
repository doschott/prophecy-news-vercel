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
    CREATE TABLE IF NOT EXISTS prophecy_videos (
      id SERIAL PRIMARY KEY,
      videos JSONB NOT NULL,
      total_videos INTEGER NOT NULL,
      prophecy_videos INTEGER NOT NULL,
      channel_count INTEGER NOT NULL,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { category, days } = req.query
  const client = await pool.connect()

  try {
    await initTable(client)

    const result = await client.query(
      `SELECT videos, total_videos, prophecy_videos, channel_count, last_updated
       FROM prophecy_videos
       ORDER BY created_at DESC
       LIMIT 1`
    )

    if (result.rows.length === 0) {
      return res.status(200).json({
        videos: [],
        totalVideos: 0,
        prophecyVideos: 0,
        channelCount: 0,
        lastUpdated: null
      })
    }

    const row = result.rows[0]
    let videos = row.videos || []

    // Filter by category if provided
    if (category && category.toLowerCase() !== 'all') {
      videos = videos.filter(v => 
        v.video_category && v.video_category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filter by days if provided
    if (days) {
      const daysNum = parseInt(days, 10)
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - daysNum)
      videos = videos.filter(v => new Date(v.published_at) >= cutoff)
    }

    // Count trending videos
    const trendingCount = (row.videos || []).filter(v => v.is_trending).length

    return res.status(200).json({
      videos,
      totalVideos: row.total_videos,
      prophecyVideos: row.prophecy_videos,
      channelCount: row.channel_count,
      trendingCount,
      lastUpdated: row.last_updated
    })
  } catch (error) {
    console.error('Videos read error:', error)
    return res.status(500).json({ error: 'Failed to read videos' })
  } finally {
    client.release()
  }
}
