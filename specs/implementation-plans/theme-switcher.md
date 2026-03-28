# Implementation Plan: Theme Switcher

## Overview
Add a dropdown menu in the navigation to switch between 4 themes. Store preference in a cookie so it persists.

## Themes

### 1. Futuristic/Cyber (already implemented)
- Primary: Cyan #00f0ff, Purple #bf00ff, Magenta #ff00ff
- Dark background with neon glow effects

### 2. Bold & Vibrant (NEW)
- Primary: Orange #ff6b35, Teal #00d4aa, Pink #ff3366
- Dark but warm, strong saturated colors
- Bold shadows and high contrast

### 3. Clean Modern (NEW)
- Primary: Blue #3b82f6, Slate #64748b, White #f8fafc
- Light or neutral dark (#1e293b), minimal shadows
- Clean typography, subtle borders

### 4. Editorial/Magazine (NEW)
- Primary: Gold #d4af37, Burgundy #722f37, Cream #f5f0e1
- Rich, warm tones with classic typography
- Magazine-style layout with elegant borders

## Implementation

### Cookie
- [x] Set cookie `theme` with value `cyber|bold|clean|editorial`
- [x] Cookie should persist for 365 days
- [x] Read cookie on page load to apply saved theme

### Theme Selector Component
- [x] Add dropdown in navigation (top right)
- [x] Show current theme name
- [x] Dropdown with 4 theme options
- [x] On selection, save cookie and apply theme

### CSS Architecture
- [x] Create `styles/themes/` directory
- [x] Create `themes/cyber.css` (already in globals.css/Home.module.css)
- [x] Create `themes/bold.css` (new)
- [x] Create `themes/clean.css` (new)
- [x] Create `themes/editorial.css` (new)
- [x] Only load active theme CSS to avoid conflicts

### Theme Switching Logic
- [x] Apply theme class to body or root element
- [x] Remove old theme class when switching
- [x] Add new theme class
- [x] Force CSS reload by toggling stylesheet

### Globals.css Updates
- [x] Move all cyber theme CSS to `themes/cyber.css`
- [x] Add theme-specific variable overrides per theme
- [x] Add theme transition animations

### Files to Modify/Create
- [x] `pages/_app.js` - Theme provider/selector logic
- [x] `pages/index.js` - Add theme dropdown to nav
- [x] `pages/trends.js` - Add theme dropdown to nav
- [x] `pages/videos.js` - Add theme dropdown to nav
- [x] `styles/globals.css` - Remove cyber-specific CSS, add theme base
- [x] `styles/themes/cyber.css` - Cyber theme variables
- [x] `styles/themes/bold.css` - Bold & Vibrant theme
- [x] `styles/themes/clean.css` - Clean Modern theme
- [x] `styles/themes/editorial.css` - Editorial/Magazine theme
