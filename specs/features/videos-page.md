# Feature: Videos Page

## Overview
Add a "Videos" tab to the Vercel-hosted dashboard at https://prophecy-sage.vercel.app/ that displays prophecy-related YouTube videos collected by the local tracker.

## Data Source
The local prophecy-news-tracker collects YouTube videos and stores them in SQLite. We need to extend the data pipeline to push video data to Vercel Postgres.

## Video Data Structure
```json
{
  "videos": [
    {
      "id": 1,
      "video_id": "dQw4w9WgXcQ",
      "title": "Video Title",
      "description": "Video description...",
      "channel_id": "UC...",
      "channel_name": "Channel Name",
      "published_at": "2026-03-27T10:00:00",
      "collected_at": "2026-03-27T12:00:00",
      "image_url": "https://...",
      "thumbnail_url": "https://...",
      "video_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
      "duration_seconds": 1234,
      "view_count": 50000,
      "like_count": 2500,
      "relevance_score": 0.85,
      "is_prophecy_related": true,
      "video_category": "war",
      "is_trending": false
    }
  ],
  "totalVideos": 50,
  "prophecyVideos": 30,
  "channelCount": 10
}
```

## UI Components
1. **Summary stats row** - Total Videos, Prophecy Videos, Channels, Trending
2. **Category filter tabs** - All, Economic, Technology, War, Israel, etc.
3. **Video grid** - Card layout with:
   - Thumbnail image
   - Title (truncated)
   - Channel name
   - View count
   - Duration
   - Relevance badge
   - Link to YouTube

## Design
- Match dark theme of existing dashboard
- Video cards in responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- Thumbnail with play overlay
- Hover effects on cards

## Data Pipeline Extension
1. Extend `push-to-vercel.py` to query video data from SQLite
2. Add `/api/videos` endpoint to Vercel (or include in existing data push)
3. Create `prophecy_videos` table in Postgres

## Files to Create/Modify
- `pages/videos.js` - New videos page component
- `pages/index.js` - Add Videos tab to navigation
- `api/videos.js` - API endpoint for video data (GET)
- `api/ingest.js` - Modify to accept video data
- `push-to-vercel.py` - Extend to push video data
- `styles/Home.module.css` - Video card styles
