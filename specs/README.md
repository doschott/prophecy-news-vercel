# Prophecy News Vercel Dashboard

## Overview
Public-facing React dashboard for the Prophecy News Tracker that syncs data from the local Windows machine via serverless API endpoints on Vercel.

## Architecture
- **Local machine** (Windows/WSL): collects, scores, and stores articles
- **Vercel**: hosts React dashboard + serverless functions
- **GitHub integration**: push to GitHub → Vercel auto-deploys

## Data Flow
1. Local Python collects articles from RSS feeds
2. Local Python scores articles (critical/non-critical)
3. Local Node.js (`push-to-vercel.js`) POSTs data to Vercel
4. Vercel `api/ingest.js` receives data and writes to `data/data.json`
5. React dashboard fetches from `api/data.js` and displays

## Features
- Display scored prophetic news articles
- Filter by critical/non-critical
- Search/filter by keyword
- Show article metadata (source, date, score)
- Responsive design for mobile/desktop
- Clean, modern UI matching the prophetic news theme

## Tech Stack
- Next.js (React framework)
- Vercel serverless functions (api/)
- Static JSON storage
- CSS Modules for styling

## Deployment
- GitHub-connected to Vercel
- Auto-deploy on push to main branch
- Preview deploys for PRs
