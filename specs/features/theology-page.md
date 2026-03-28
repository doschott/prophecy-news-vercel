# Feature: Theology Page

## Overview
Add a "Theology" tab to the Vercel dashboard showcasing supporting theologians with rotating quotes, theologian profiles, and theological highlights.

## Data Source
Local SQLite database has `theologians` and `theologian_insights` tables with:
- 3 theologians: Charles Ryrie, John Walvoord, Tim LaHaye
- Multiple insight quotes per theologian

## Data Structure (from push-to-vercel)
```json
{
  "theologians": [
    {
      "id": 1,
      "name": "Charles Ryrie",
      "full_name": "Charles Caldwell Ryrie",
      "description": "Author of the Ryrie Study Bible, prominent dispensationalist",
      "education": "Dallas Theological Seminary, Ph.D.",
      "key_beliefs": ["Dispensationalism", "Pretribulation rapture", "Literal interpretation of Scripture"],
      "notable_works": ["Ryrie Study Bible", "Dispensationalism: Tonight and Tomorrow"],
      "quote": "The study of eschatology should produce practical holiness, not mere speculation."
    }
  ]
}
```

## UI Components

### 1. Rotating Quote Section (Top)
- Large quote display with theologian name
- Auto-rotates through quotes every 8-10 seconds
- Subtle fade transition animation
- Styled like a blockquote with attribution

### 2. Theologian Profiles Section
- Grid or list of theologian cards
- Each card shows:
  - Name and title
  - Brief description
  - Key beliefs tags

### 3. Theologian Highlights Section
- Expandable or tabbed section for each theologian
- Detailed information:
  - **Education**: Where they studied
  - **Key Beliefs**: Core theological positions
  - **Distinctives**: How they differ from others
  - **Notable Works**: Books/publications

### 4. Comparison Section (optional)
- Side-by-side or accordion comparison of theologians
- Highlight differences in beliefs

## Design
- Match existing dark cyberpunk theme
- Quote section: large italic text, accent border, theologian name below
- Cards: consistent with existing card styling
- Sections clearly separated with headers

## Data Pipeline

### Local (push-to-vercel.py)
- [x] Add `get_theologians_for_dashboard()` function
- [x] Query from `theologians` and `theologian_insights` tables
- [x] Include in POST to Vercel

### Vercel Backend
- [x] Extend `/api/ingest` to accept `{ ..., theologians: [...] }`
- [x] Create `prophecy_theologians` table
- [x] Create `/api/theologians` GET endpoint

### Vercel Frontend
- [x] Create `pages/theology.js`
- [x] Add Theology tab to navigation
- [x] Rotating quote carousel
- [x] Theologian cards grid
- [x] Detailed highlights per theologian

## Files to Create/Modify
- `pages/theology.js` - New theology page
- `api/ingest.js` - Extend to accept theologian data
- `api/theologians.js` - New GET endpoint
- `pages/index.js` - Add Theology tab
- `pages/trends.js` - Add Theology tab  
- `pages/videos.js` - Add Theology tab
- `push-to-vercel.py` - Add theologian data push
- `styles/Home.module.css` - Add theology-specific styles
