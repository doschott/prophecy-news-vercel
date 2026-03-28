# Implementation Plan: Theology Page

## Phase 1: Vercel Backend

### Database
- [x] Add `prophecy_theologians` table schema to `api/ingest.js` (auto-create)
- [x] Table stores: theologians JSONB, last_updated

### API Endpoints
- [x] Extend `api/ingest.js` to accept `{ ..., theologians: [...] }`
- [x] Create `api/theologians.js` - GET endpoint returning theologians from Postgres

## Phase 2: Local Push Script
- [ ] Add `get_theologians_for_dashboard()` to `push-to-vercel.py`
- [ ] Query `theologians` and `theologian_insights` tables
- [ ] Include in POST to Vercel

## Phase 3: Vercel Frontend

### Core Implementation
- [x] Create `pages/theology.js` with React component
- [x] Add Theology tab to navigation in all pages

### UI Components
- [x] Rotating quote banner (auto-rotates every 8 seconds)
- [x] Theologian cards grid (3 columns)
- [x] Individual theologian highlight sections with:
  - Education background
  - Key beliefs
  - Distinctives/differences from other theologians
  - Notable works

### Styling
- [x] Quote banner: large italic text, accent border, fade transition
- [x] Theologian cards: match existing dark theme
- [x] Accordion or tabs for detailed information

## Phase 4: Testing
- [ ] Push to GitHub
- [ ] Redeploy Vercel
- [ ] Update push-to-vercel.py on local machine
- [ ] Verify theologian data displays correctly
