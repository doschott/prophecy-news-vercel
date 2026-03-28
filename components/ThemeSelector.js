import { useState, useEffect } from 'react'
import styles from '../styles/ThemeSelector.module.css'

const THEMES = [
  { value: 'cyber', label: '⚡ Cyber', color: '#00f0ff' },
  { value: 'bold', label: '🔥 Bold', color: '#ff6b35' },
  { value: 'clean', label: '💠 Clean', color: '#3b82f6' },
  { value: 'editorial', label: '📜 Editorial', color: '#d4af37' },
]

function getThemeFromCookie() {
  if (typeof document === 'undefined') return 'cyber'
  const match = document.cookie.match(/theme=(\w+)/)
  return match ? match[1] : 'cyber'
}

function setThemeCookie(theme) {
  document.cookie = `theme=${theme};max-age=${365 * 24 * 60 * 60};path=/;SameSite=Lax`
}

export function ThemeSelector() {
  const [theme, setTheme] = useState('cyber')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = getThemeFromCookie()
    setTheme(saved)
    setMounted(true)
  }, [])

  function handleChange(e) {
    const newTheme = e.target.value
    setTheme(newTheme)
    setThemeCookie(newTheme)
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  if (!mounted) {
    return <div className={styles.selector} />
  }

  return (
    <div className={styles.selector}>
      <select
        value={theme}
        onChange={handleChange}
        className={styles.select}
        style={{ borderColor: THEMES.find(t => t.value === theme)?.color }}
      >
        {THEMES.map(t => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  )
}
