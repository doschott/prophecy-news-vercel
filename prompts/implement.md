# Implementation Prompt

You are adding a Videos page to the Vercel-hosted React dashboard for the Prophecy News Tracker project.

## Project Location
`/home/dosubuntu/clawd/projects/prophecy-news-vercel/`

## Current Task
Read the feature spec at:
`/home/dosubuntu/clawd/projects/prophecy-news-vercel/specs/features/videos-page.md`

And the implementation plan at:
`/home/dosubuntu/clawd/projects/prophecy-news-vercel/specs/implementation-plans/videos-page.md`

Work through the unchecked tasks. Mark each checkbox as complete `[x]` when done.

## Existing Video Data (from push-to-vercel.py)
Videos pushed from local will have this structure:
```json
{
  "videos": [
    {
      "id": 1,
      "video_id": "dQw4w9WgXcQ",
      "title": "Video Title",
      "channel_name": "Channel Name",
      "published_at": "2026-03-27T10:00:00",
      "thumbnail_url": "https://...",
      "video_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
      "duration_seconds": 1234,
      "view_count": 50000,
      "relevance_score": 0.85,
      "is_prophecy_related": true,
      "video_category": "war",
      "is_trending": false
    }
  ]
}
```

## API Changes Needed
1. `api/ingest.js` - Already handles `{ articles, totalArticles, criticalCount }`. Extend to also accept `{ videos, totalVideos, prophecyVideos, channelCount }`

2. `api/videos.js` - NEW endpoint that returns videos from Postgres table `prophecy_videos`

## Styling
- Use CSS Modules (Home.module.css)
- Dark theme matching dashboard: #12121a, #1a1a2e, #f0f0f0, #888
- Video cards: dark background, thumbnail on left, info on right
- Category filter tabs similar to existing tab styles

## Important
- Check each task box as complete when done
- When all tasks are complete, output `<promise>COMPLETE</promise>`
- Use Next.js pages router (not app router)
- Video card should link to YouTube video on click
- Show "No videos yet" when database is empty (before push script is updated)
- Do NOT modify push-to-vercel.py - that's done separately on the local machine
