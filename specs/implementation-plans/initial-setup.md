# Implementation Plan: Prophecy News Vercel Dashboard

## Prerequisites
- [ ] Create GitHub repo for the project
- [ ] Connect repo to Vercel

---

## Task 1: Initialize Next.js project with package.json and vercel.json
- [ ] Create `package.json` with Next.js dependencies
- [ ] Create `vercel.json` for routing configuration
- [ ] Create `next.config.js` with basic settings
- [ ] Test that `vercel dev` runs

---

## Task 2: Create serverless API endpoints
- [x] Create `api/ingest.js` - accepts POST with article data, writes to data.json
- [x] Create `api/data.js` - serves current data via GET
- [ ] Test API endpoints locally with curl

---

## Task 3: Create initial data.json stub
- [ ] Create `data/data.json` with sample data structure
- [ ] Document expected data format from local prophecy-news-tracker

---

## Task 4: Build React dashboard (pages/index.js)
- [ ] Create main dashboard component
- [ ] Fetch data from `/api/data`
- [ ] Display article list with title, source, date, score
- [ ] Filter toggle for critical/non-critical
- [ ] Search/filter by keyword
- [ ] Add CSS Modules styling
- [ ] Make responsive

---

## Task 5: Add basic styling
- [ ] Create `styles/Home.module.css`
- [ ] Style article cards
- [ ] Style filter controls
- [ ] Style header
- [ ] Ensure mobile responsiveness

---

## Task 6: Create local push script
- [ ] Document `push-to-vercel.js` that runs on local machine
- [ ] Include example curl command for testing

---

## Task 7: Create .gitignore and README
- [ ] Add proper .gitignore (exclude node_modules, .next, data.json)
- [ ] Create README with setup instructions

---

## Task 8: Final verification
- [ ] Verify all files exist and are correct
- [ ] Document deployment workflow
- [ ] Output git commands to push to GitHub

---

**Completion marker:** `<promise>COMPLETE</promise>`
