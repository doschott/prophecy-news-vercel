# Implementation Plan: Prophecy Trends Page

## Setup
- [x] Add Chart.js CDN to `pages/_app.js` or `pages/index.js`

## Core Implementation
- [x] Create `pages/trends.js` with React component
- [x] Add tab navigation to `pages/index.js` (Dashboard | Trends)
- [x] Implement `computeTrends(articles, days)` utility function

## UI Components
- [x] Summary stat cards (articles count, high relevance, avg score)
- [x] Activity line chart (daily counts over time)
- [x] Category pie chart
- [x] Relevance distribution bar chart
- [x] Period selector (7/14/30 days)

## Styling
- [x] Add dark theme chart colors
- [x] Match existing dashboard card/grid styles

## Integration
- [x] Fetch data from `/api/data` endpoint (existing)
- [x] Wire up period selector to update charts
- [x] Add version bump for deployment

## Testing
- [x] Verify charts render with real data
- [x] Verify period selector changes chart data
- [x] Test on mobile viewport
