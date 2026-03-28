# Implementation Prompt

You are building a Vercel-hosted React dashboard for the Prophecy News Tracker project.

## Project Location
`/home/dosubuntu/clawd/projects/prophecy-news-vercel/`

## Current Task
Read the active implementation plan at:
`/home/dosubuntu/clawd/projects/prophecy-news-vercel/specs/implementation-plans/initial-setup.md`

Work through the unchecked tasks. Mark each checkbox as complete `[x]` when done. Create all necessary files.

## Data Format
The local prophecy-news-tracker produces articles with this structure:
```json
{
  "articles": [
    {
      "title": "Article Title",
      "url": "https://example.com/article",
      "source": "Source Name",
      "published": "2026-03-27T10:00:00Z",
      "summary": "Brief summary of the article...",
      "score": 85,
      "critical": true,
      "categories": ["prophecy", "middle-east"]
    }
  ],
  "lastUpdated": "2026-03-27T10:00:00Z",
  "totalArticles": 100,
  "criticalCount": 25
}
```

## API Endpoints

### POST /api/ingest
Receives article data from local machine. Writes to `data/data.json`.

### GET /api/data
Returns current articles from `data/data.json`.

## Styling
Use CSS Modules (`.module.css` files). Dark theme with prophetic news aesthetic. Simple, clean, readable.

## Important
- Check each task box as complete when done
- When all tasks are complete, output `<promise>COMPLETE</promise>`
- Use Next.js pages router (not app router)
- Keep code simple and functional
- Do NOT install dependencies or run npm install - just create the files

## Files to Create
- package.json
- vercel.json
- next.config.js
- pages/_app.js
- pages/index.js
- api/ingest.js
- api/data.js
- data/data.json (with sample data)
- styles/Home.module.css
- .gitignore
- README.md
