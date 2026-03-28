# Prophecy News Vercel Dashboard

A Vercel-hosted React dashboard for the Prophecy News Tracker project.

## Overview

This dashboard displays prophetic news articles with:
- Article list with title, source, date, and relevance score
- Critical/non-critical filtering
- Search functionality
- Dark theme with prophetic aesthetic

## Data Format

Articles should be sent in this structure:
```json
{
  "articles": [
    {
      "title": "Article Title",
      "url": "https://example.com/article",
      "source": "Source Name",
      "published": "2026-03-27T10:00:00Z",
      "summary": "Brief summary...",
      "score": 85,
      "critical": true,
      "categories": ["prophecy", "middle-east"]
    }
  ],
  "totalArticles": 100,
  "criticalCount": 25
}
```

## API Endpoints

### GET /api/data
Returns current articles from the dashboard.

### POST /api/ingest
Receives article data from local machine. Writes to `data/data.json`.

## Local Push Script

To push data from your local prophecy-news-tracker:

```bash
# Example curl command
curl -X POST https://your-vercel-url.vercel.app/api/ingest \
  -H "Content-Type: application/json" \
  -d @data/articles.json
```

Or create a `push-to-vercel.js` script:
```javascript
const fs = require('fs')
const https = require('https')

const data = JSON.parse(fs.readFileSync('path/to/data.json', 'utf8'))

const options = {
  hostname: 'your-vercel-url.vercel.app',
  port: 443,
  path: '/api/ingest',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

const req = https.request(options, (res) => {
  let body = ''
  res.on('data', chunk => body += chunk)
  res.on('end', () => console.log(body))
})

req.write(JSON.stringify(data))
req.end()
```

## Deployment

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/prophecy-news-vercel.git
git push -u origin main
```

2. Connect to Vercel:
   - Go to vercel.com
   - Import the GitHub repo
   - Deploy

## Development

```bash
npm install
npm run dev
```

## Files Structure

```
├── api/
│   ├── data.js      # GET endpoint for fetching articles
│   └── ingest.js    # POST endpoint for receiving articles
├── data/
│   └── data.json    # Article data storage
├── pages/
│   ├── _app.js      # Next.js app wrapper
│   └── index.js     # Main dashboard page
├── styles/
│   ├── globals.css  # Global styles
│   └── Home.module.css
├── package.json
├── vercel.json
├── next.config.js
└── README.md
```
