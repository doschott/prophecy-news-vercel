# Implementation Plan: Videos Page

## Phase 1: Vercel Backend (API + Database)

### Database
- [x] Add `prophecy_videos` table schema to `api/videos.js` (auto-create on call)

### API Endpoints
- [x] Create `api/videos.js` - GET endpoint returning videos from Postgres
- [x] Modify `api/ingest.js` to accept and store video data alongside articles

## Phase 2: Local Push Script
- [ ] Extend `push-to-vercel.py` to query video data from local SQLite
- [ ] Include video data in POST to Vercel `/api/ingest`

## Phase 3: Vercel Frontend (Videos Page)

### Core Implementation
- [x] Create `pages/videos.js` with React component
- [x] Add Videos tab to navigation in `pages/index.js`
- [x] Fetch videos from `/api/videos` endpoint

### UI Components
- [x] Summary stat cards (total, prophecy, channels, trending)
- [x] Category filter tabs (All, Economic, Technology, War, Israel, Mark of Beast, etc.)
- [x] Video grid with cards
- [x] Video card with thumbnail, title, channel, views, duration, badge

### Styling
- [x] Video card styles matching dark theme
- [x] Responsive grid layout
- [x] Hover effects

## Phase 4: Integration & Testing
- [ ] Push to GitHub
- [ ] Redeploy Vercel
- [ ] Test with real video data (after push script is updated)
- [ ] Verify videos display correctly
