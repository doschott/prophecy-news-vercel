# Implementation Plan: Fix Theme Switcher

## Goal
Make theme switching work properly with unique, polished themes. Keep the cyberpunk theme intact.

## Current State
- Cyber theme works perfectly with `--cyber-*` variables
- Theme switcher is disabled (ThemeSelector removed from pages)
- themes/ folder has cyber.css, bold.css, clean.css, editorial.css files

## Tasks

### 1. Theme Architecture
- [x] Use data-theme attribute approach (data-theme="cyber", data-theme="bold", etc.)
- [x] Each theme file sets CSS variables that override cyber defaults
- [x] Variables MUST use same names as cyber theme: --cyber-cyan, --cyber-purple, --cyber-bg, etc.
- [x] Each theme has its own unique accent colors that map to the cyber variable names

### 2. Theme Definitions (each must be visually stunning)

**Cyber (ALREADY PERFECT):**
- Accent: Cyan #00f0ff, Purple #bf00ff, Magenta #ff00ff
- Background: Dark #0a0a12
- Glow effects with neon

**Bold & Vibrant:**
- Accent: Orange #ff6b35, Teal #00d4aa, Pink #ff3366  
- Background: Rich dark #121212
- Glow effects with warm neon

**Clean Modern:**
- Accent: Blue #3b82f6, Slate #64748b, Emerald #10b981
- Background: Deep slate #0f172a or light mode
- Subtle glow, clean shadows

**Editorial:**
- Accent: Gold #d4af37, Burgundy #722f37, Cream #f5f0e1
- Background: Rich dark brown #1a1510
- Elegant glow, serif typography feel

### 3. Re-enable Theme Switcher
- [x] Add ThemeSelector component to pages/_app.js or each page
- [x] Read cookie on page load, apply theme
- [x] On selection, update cookie AND apply theme immediately
- [x] Cookie: `theme=cyber|bold|clean|editorial` max-age=365 days

### 4. Files to Modify
- `pages/_app.js` - Add theme provider with cookie handling
- `components/ThemeSelector.js` - Keep this component
- `styles/themes/cyber.css` - Keep as is (already perfect)
- `styles/themes/bold.css` - Rewrite with --cyber-* variable names
- `styles/themes/clean.css` - Rewrite with --cyber-* variable names  
- `styles/themes/editorial.css` - Rewrite with --cyber-* variable names
- `pages/index.js` - Add ThemeSelector back
- `pages/trends.js` - Add ThemeSelector back
- `pages/videos.js` - Add ThemeSelector back

### 5. Key Implementation Details

**Cookie Functions:**
```javascript
const getTheme = () => {
  if (typeof document === 'undefined') return 'cyber'
  const match = document.cookie.match(/theme=(\w+)/)
  return match ? match[1] : 'cyber'
}

const setTheme = (theme) => {
  document.cookie = `theme=${theme};max-age=${365*24*60*60};path=/;SameSite=Lax`
  document.documentElement.setAttribute('data-theme', theme)
}
```

**Theme CSS pattern:**
```css
[data-theme="bold"] {
  --cyber-cyan: #ff6b35;  /* Orange instead of cyan */
  --cyber-purple: #00d4aa;  /* Teal instead of purple */
  --cyber-bg: #121212;  /* Rich dark */
  /* etc - keep variable names same but change values */
}
```

**Theme Selector Position:**
- Top right of header, next to version badge
- Clean dropdown with theme name + color indicator
