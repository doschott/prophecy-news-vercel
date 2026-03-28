import { useState, useEffect } from 'react'
import '../styles/globals.css'
import '../styles/themes/cyber.css'
import '../styles/themes/bold.css'
import '../styles/themes/clean.css'
import '../styles/themes/editorial.css'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

Chart.defaults.color = '#888'
Chart.defaults.borderColor = '#1a1a2e'
Chart.defaults.backgroundColor = '#12121a'

function getThemeFromCookie() {
  if (typeof document === 'undefined') return 'cyber'
  const match = document.cookie.match(/theme=(\w+)/)
  return match ? match[1] : 'cyber'
}

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState('cyber')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = getThemeFromCookie()
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    setMounted(true)
  }, [])

  return <Component {...pageProps} theme={theme} setTheme={setTheme} mounted={mounted} />
}
