# Implementation Plan: Archive Page

## Phase 1: API Endpoint

### Task 1: Create Archive API (`api/archive.js`)
- [x] Create `api/archive.js` with GET handler
- [x] Connect to Neon Postgres using existing pool pattern
- [x] Parse query parameters (search, startDate, endDate, trustLevel, minRelevance, page, limit)
- [x] Build SQL query with filters
- [x] Implement pagination with OFFSET/LIMIT
- [x] Return formatted JSON response
- [x] Handle errors gracefully

## Phase 2: Frontend Page

### Task 2: Create Archive Page (`pages/archive.js`)
- [x] Create React component with state (articles, loading, error, searchQuery, filters, pagination)
- [x] Add search input field
- [x] Add date range inputs (start date, end date)
- [x] Add trust level dropdown
- [x] Add minimum relevance score input
- [x] Add search button and results display
- [x] Implement pagination controls
- [x] Style to match existing dark theme
- [x] Add export buttons (CSV/JSON) - stretch goal

### Task 3: Integrate Archive into Navigation
- [x] Add Archive tab to the navigation bar/tab system
- [x] Ensure routing works correctly

## Phase 3: Testing & Deployment

### Task 4: Local Testing
- [ ] Test API endpoint with various query parameters
- [ ] Test frontend page with real data
- [ ] Verify search, filters, and pagination work correctly

### Task 5: Deploy
- [ ] Push changes to GitHub
- [ ] Verify Vercel deployment succeeds
- [ ] Test on live URL

## Dependencies
- Existing `api/data.js` pattern for Postgres connection
- Existing `pages/index.js` for styling reference
- Prophecy data stored in Neon Postgres `prophecy_data` table