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

    // Filter to past 2 weeks by default if no days specified
    const daysNum = days ? parseInt(days, 10) : 14
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - daysNum)
    videos = videos.filter(v => new Date(v.published_at) >= cutoff)

    // Sort by date (most recent) then by views (highest to lowest)
    videos.sort((a, b) => {
      const dateA = new Date(a.published_at || 0)
      const dateB = new Date(b.published_at || 0)
      // Compare only the calendar date (year-month-day), not time
      const dayA = dateA.toISOString().split('T')[0]
      const dayB = dateB.toISOString().split('T')[0]
      if (dayB !== dayA) return dayB.localeCompare(dayA)
      return (b.view_count || 0) - (a.view_count || 0)
    })

    // Filter by category if provided
    if (category && category.toLowerCase() !== 'all') {
      videos = videos.filter(v => 
        v.video_category && v.video_category.toLowerCase() === category.toLowerCase()
      )
    }

    // Count trending videos
    const trendingCount = (row.videos || []).filter(v => v.is_trending).length

    // Compute category distribution
    const categoryCounts = {}
    ;(row.videos || []).forEach(v => {
      const cat = v.video_category || 'Other'
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })

    // Compute source (channel) distribution
    const sourceCounts = {}
    const sourceList = []
    ;(row.videos || []).forEach(v => {
      const channel = v.channel_name || 'Unknown'
      if (!sourceCounts[channel]) {
        sourceCounts[channel] = {
          name: channel,
          count: 0,
          totalViews: 0
        }
      }
      sourceCounts[channel].count++
      sourceCounts[channel].totalViews += v.view_count || 0
    })
    Object.values(sourceCounts).forEach(s => sourceList.push(s))
    sourceList.sort((a, b) => b.count - a.count)

    return res.status(200).json({
      videos,
      totalVideos: row.total_videos,
      prophecyVideos: row.prophecy_videos,
      channelCount: row.channel_count,
      trendingCount,
      categoryDistribution: categoryCounts,
      sources: sourceList.slice(0, 10),
      lastUpdated: row.last_updated
    })
  } catch (error) {
    console.error('Videos read error:', error)
    return res.status(500).json({ error: 'Failed to read videos' })
  } finally {
    client.release()
  }
}
