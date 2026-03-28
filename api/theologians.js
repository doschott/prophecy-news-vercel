import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

// Default sample theologians
const DEFAULT_THEOLOGIANS = [
  {
    id: 1,
    name: "Charles Ryrie",
    full_name: "Charles Caldwell Ryrie",
    description: "Author of the Ryrie Study Bible, prominent dispensationalist",
    education: "Dallas Theological Seminary, Ph.D.",
    key_beliefs: ["Dispensationalism", "Pretribulation rapture", "Literal interpretation of Scripture"],
    distinctives: "Emphasizes the distinction between God's program for Israel and the Church",
    notable_works: ["Ryrie Study Bible", "Dispensationalism: Tonight and Tomorrow"],
    quote: "The study of eschatology should produce practical holiness, not mere speculation."
  },
  {
    id: 2,
    name: "John Walvoord",
    full_name: "John Francis Walvoord",
    description: "Major evangelical scholar on end-times prophecy",
    education: "Dallas Theological Seminary",
    key_beliefs: ["Pretribulation rapture", "Premillennialism", "Israel in God's plan"],
    distinctives: "Focused heavily on biblical prophecy and its relevance to current events",
    notable_works: ["The Revelation of Jesus Christ", "Israel in Prophecy"],
    quote: "The tribulation will be a time of divine judgment, but also mercy."
  },
  {
    id: 3,
    name: "Tim LaHaye",
    full_name: "Timothy LaHaye",
    description: "Co-author of Left Behind series, dispensationalist",
    education: "Dallas Theological Seminary, D.D.",
    key_beliefs: ["Pretribulation rapture", "Dispensationalism", "Biblical inerrancy"],
    distinctives: "Made eschatology accessible to mainstream audiences through fiction",
    notable_works: ["Left Behind series", "Revelation Unveiled"],
    quote: "Understanding dispensationalism helps believers maintain hope during turbulent times."
  }
]

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const client = await pool.connect()

  try {
    const result = await client.query(
      `SELECT theologians, last_updated
       FROM prophecy_theologians
       ORDER BY created_at DESC
       LIMIT 1`
    )

    if (result.rows.length === 0) {
      return res.status(200).json({
        theologians: DEFAULT_THEOLOGIANS,
        lastUpdated: null
      })
    }

    const row = result.rows[0]
    return res.status(200).json({
      theologians: row.theologians,
      lastUpdated: row.last_updated
    })
  } catch (error) {
    console.error('Theologians read error:', error)
    return res.status(500).json({ error: 'Failed to read theologians', details: error.message })
  } finally {
    client.release()
  }
}
