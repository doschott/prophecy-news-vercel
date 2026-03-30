# Ralph Loop: Archive Page Implementation

## Project Context
You are working on the Prophecy News Vercel Dashboard at `/home/dosubuntu/clawd/projects/prophecy-news-vercel/`

## Goal
Build an Archive page feature that allows users to search through all historical prophecy articles (not just the last 48 hours).

## Reference Files
- Spec: `specs/features/archive-page.md`
- Plan: `specs/implementation-plans/archive-page.md`
- Existing API pattern: `api/data.js`
- Existing page pattern: `pages/index.js`
- Existing styling: `styles/Home.module.css`

## Your Task
Execute the implementation plan by completing the tasks marked with `[ ]`.

## Steps to Follow

### 1. Read the spec and plan
- Read `specs/features/archive-page.md`
- Read `specs/implementation-plans/archive-page.md`

### 2. Create the Archive API (`api/archive.js`)
Read `api/data.js` to understand the Postgres pool pattern, then create `api/archive.js`:
- Connect to Neon Postgres
- Accept query params: search, startDate, endDate, trustLevel, minRelevance, page, limit
- Search through all articles JSONB field
- Filter by date range, trust level, min relevance
- Return paginated results with total count

### 3. Create the Archive Page (`pages/archive.js`)
Read `pages/index.js` and `pages/videos.js` for component patterns, then create `pages/archive.js`:
- Search input for text queries
- Date range inputs
- Trust level dropdown
- Min relevance input
- Results grid
- Pagination controls
- Match the dark theme styling

### 4. Add Archive to Navigation
Update `pages/index.js` to add an Archive tab in the navigation bar.

### 5. Mark Tasks Complete
After completing each task, update `specs/implementation-plans/archive-page.md` to check off `[x]` for completed items.

## Important Notes
- Use the existing Postgres pool pattern from `api/data.js`
- Match styling from existing pages (dark theme with cyberpunk accents)
- Articles data structure: `{ title, content, summary, source, source_url, published, relevance_score, trust_level }`
- The `prophecy_data` table stores articles in a JSONB array called `articles`

## Output
When all tasks are complete, output `<promise>COMPLETE</promise>` to signal the loop can exit.
