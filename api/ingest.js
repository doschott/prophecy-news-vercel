import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

async function initArticlesTable(client) {
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

async function initVideosTable(client) {
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

async function initTheologiansTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS prophecy_theologians (
      id SERIAL PRIMARY KEY,
      theologians JSONB NOT NULL,
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
    const { articles, totalArticles, criticalCount, videos, totalVideos, prophecyVideos, channelCount, theologians } = req.body

    // Handle articles if provided
    if (articles !== undefined) {
      if (!Array.isArray(articles)) {
        return res.status(400).json({ error: 'articles must be an array' })
      }

      await initArticlesTable(client)
      await client.query('DELETE FROM prophecy_data')
      
      await client.query(
        `INSERT INTO prophecy_data (articles, total_articles, critical_count, last_updated)
         VALUES ($1, $2, $3, NOW())
         RETURNING *`,
        [JSON.stringify(articles), totalArticles || articles.length, criticalCount || 0]
      )
    }

    // Handle videos if provided
    if (videos !== undefined) {
      if (!Array.isArray(videos)) {
        return res.status(400).json({ error: 'videos must be an array' })
      }

      await initVideosTable(client)
      await client.query('DELETE FROM prophecy_videos')
      
      await client.query(
        `INSERT INTO prophecy_videos (videos, total_videos, prophecy_videos, channel_count, last_updated)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING *`,
        [JSON.stringify(videos), totalVideos || videos.length, prophecyVideos || 0, channelCount || 0]
      )
    }

    // Handle theologians if provided
    if (theologians !== undefined) {
      if (!Array.isArray(theologians)) {
        return res.status(400).json({ error: 'theologians must be an array' })
      }

      await initTheologiansTable(client)
      await client.query('DELETE FROM prophecy_theologians')
      
      await client.query(
        `INSERT INTO prophecy_theologians (theologians, last_updated)
         VALUES ($1, NOW())
         RETURNING *`,
        [JSON.stringify(theologians)]
      )
    }

    return res.status(200).json({
      success: true,
      message: 'Data ingested successfully'
    })
  } catch (error) {
    console.error('Ingest error:', error)
    return res.status(500).json({ error: 'Failed to ingest data', details: error.message })
  } finally {
    client.release()
  }
}
