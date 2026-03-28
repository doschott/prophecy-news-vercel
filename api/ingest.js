const fs = require('fs')
const path = require('path')

// Use /tmp for writable storage in serverless
const DATA_FILE = '/tmp/data.json'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { articles, totalArticles, criticalCount } = req.body

    // Validate input
    if (!Array.isArray(articles)) {
      return res.status(400).json({ error: 'articles must be an array' })
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Write data to file
    const data = {
      articles,
      lastUpdated: new Date().toISOString(),
      totalArticles: totalArticles || articles.length,
      criticalCount: criticalCount || articles.filter(a => a.critical).length
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))

    return res.status(200).json({ 
      success: true, 
      message: 'Data ingested successfully',
      articleCount: articles.length
    })
  } catch (error) {
    console.error('Ingest error:', error)
    return res.status(500).json({ error: 'Failed to ingest data', details: error.message })
  }
}
