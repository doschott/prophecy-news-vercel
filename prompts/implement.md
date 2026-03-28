# Implementation Prompt

You are adding a Prophecy Trends page to the Vercel-hosted React dashboard for the Prophecy News Tracker project.

## Project Location
`/home/dosubuntu/clawd/projects/prophecy-news-vercel/`

## Current Task
Read the active implementation plan at:
`/home/dosubuntu/clawd/projects/prophecy-news-vercel/specs/implementation-plans/prophecy-trends-page.md`

Work through the unchecked tasks. Mark each checkbox as complete `[x]` when done. Create/modify all necessary files.

## Existing Data Structure
The `/api/data` endpoint returns articles with this structure:
```json
{
  "articles": [
    {
      "id": 1,
      "title": "Article Title",
      "content": "Full content...",
      "summary": "Brief summary",
      "source": "Source Name",
      "source_url": "https://example.com",
      "author": "Author Name",
      "published_at": "2026-03-27T10:00:00",
      "collected_at": "2026-03-27T12:00:00",
      "image_url": "https://...",
      "relevance_score": 0.85,
      "is_prophecy_related": true,
      "trust_score": 0.75,
      "trust_level": "reliable",
      "critical": true
    }
  ],
  "lastUpdated": "2026-03-27T10:00:00Z",
  "totalArticles": 68,
  "criticalCount": 21
}
```

## Styling
- Use CSS Modules (`.module.css` files)
- Dark theme matching existing dashboard
- Chart colors: use readable colors that work on dark backgrounds
- Keep consistent with existing card/grid styles in `styles/Home.module.css`

## Important
- Check each task box as complete when done
- When all tasks are complete, output `<promise>COMPLETE</promise>`
- Use Next.js pages router (not app router)
- Add Chart.js via CDN script tag in the page
- Compute trends client-side from the articles data already fetched from `/api/data`
- Do NOT modify the API endpoints - just use the existing `/api/data` endpoint
