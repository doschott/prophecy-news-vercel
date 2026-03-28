const fs = require('fs')
const path = require('path')

// Use /tmp for writable storage in serverless
const DATA_FILE = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' 
  ? '/tmp/data.json' 
  : path.join(process.cwd(), 'data', 'data.json')

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

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Try to read data file
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
      return res.status(200).json(data)
    }

    // Return default sample data if no file exists
    return res.status(200).json(DEFAULT_DATA)
  } catch (error) {
    console.error('Data read error:', error)
    return res.status(500).json({ error: 'Failed to read data' })
  }
}
