# Feature: Prophecy Trends Page

## Overview
Add a "Prophecy Trends" tab to the Vercel-hosted dashboard at https://prophecy-sage.vercel.app/ that displays:
- Summary stats (total articles, high relevance count, avg score) for a time period
- Line chart showing prophetic activity over time (daily article counts)
- Pie chart showing category distribution
- Bar chart showing relevance score distribution

## Data Source
The Vercel dashboard currently uses Neon Postgres for article storage. Since trends require historical aggregation that isn't stored in Postgres, we have two options:
1. **Compute trends from stored data** - Query Postgres for articles within time range and compute stats client-side
2. **Extend push-to-vercel.py** - Pre-compute trends on local machine and push to a separate Postgres table

**Chosen approach:** Option 1 (compute client-side from article data already being pushed)

## Design
- Match the dark theme of the existing dashboard
- Consistent card/grid layouts
- Use Chart.js for charts (CDN)
- Period selector: 7/14/30 days

## Data Shape (computed from articles array)
```javascript
// Summary
{ totalArticles: 68, highRelevance: 21, avgScore: 0.82 }

// Daily counts (for line chart)
[{ date: "2026-03-21", count: 12, highCount: 5 }, ...]

// Category distribution (for pie chart)
{ "Israel and Middle East": 25, "War and Conflict": 18, ... }

// Relevance distribution (for bar chart)
{ "80-100": 15, "60-79": 23, "40-59": 18, "0-39": 12 }
```

## UI Components
1. **Summary cards row** - 3 stat cards (articles, high relevance, avg score)
2. **Activity chart** - Line chart with daily counts
3. **Two-column section** - Category pie chart + Relevance bar chart

## Technical Approach
- Add `pages/trends.js` (new page) or extend `pages/index.js` with tab navigation
- Use existing `/api/data` endpoint (already returns all articles)
- Compute trends client-side from the articles array
- Add Chart.js via CDN script tag
- Dark theme chart colors matching dashboard

## Files to Create/Modify
- `pages/trends.js` - New trends page component
- `pages/index.js` - Add tab navigation with "Dashboard" and "Trends" tabs
- `styles/Home.module.css` - Add trends-specific styles
