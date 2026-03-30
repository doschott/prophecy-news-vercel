# Feature Specification: Archive Search Page

## Overview
Add a new "Archive" tab to the Prophecy News Vercel Dashboard that allows users to search and browse all historical articles (not just the last 48 hours shown on the main dashboard).

## User Story
As a user, I want to search through all historical prophecy news articles so I can find specific events, track topics over time, and research prophetic patterns.

## Core Features

### 1. Archive API Endpoint (`api/archive.js`)
- GET endpoint that queries all articles from Neon Postgres `prophecy_data` table
- Support for full-text search on title, content, summary
- Filter by date range (start/end dates)
- Filter by trust level (trusted, reliable, questionable, unreliable)
- Filter by minimum relevance score
- Pagination support (page, limit)
- Returns: `{ articles: [], total: number, page: number, totalPages: number }`

### 2. Archive Page (`pages/archive.js`)
- Search input for text queries
- Date range picker (start date, end date)
- Trust level dropdown filter
- Minimum relevance score input
- Results grid showing matching articles
- Pagination controls (Previous, Next, page info)
- Results count display
- Responsive layout matching existing dark theme

### 3. Navigation Integration
- Add "Archive" tab to the main navigation (index.js tabs or header)

### 4. Article Card Component
- Title with link to source
- Source name
- Published date
- Relevance score badge (color-coded)
- Trust level indicator
- Summary snippet

## Technical Details

### API Query Parameters
```
?search=query           # Full-text search
&startDate=YYYY-MM-DD   # Filter articles after this date
&endDate=YYYY-MM-DD     # Filter articles before this date
&trustLevel=trusted     # Filter by trust level
&minRelevance=0.7       # Minimum relevance score (0-1)
&page=1                 # Page number (default 1)
&limit=20               # Results per page (default 20)
```

### Data Structure
Articles in `prophecy_data.articles` JSONB have:
```json
{
  "title": "string",
  "content": "string",
  "summary": "string",
  "source": "string",
  "source_url": "string",
  "author": "string",
  "published": "ISO date string",
  "relevance_score": 0.0-1.0,
  "critical": boolean,
  "trust_score": 0.0-1.0,
  "trust_level": "trusted|reliable|questionable|unreliable"
}
```

## UI/UX Guidelines
- Match existing dashboard dark theme (black/gray backgrounds, accent colors)
- Consistent header and card styling with other pages
- Clear visual hierarchy for search controls
- Loading states during search
- Empty state when no results found
- Error handling with user-friendly messages
