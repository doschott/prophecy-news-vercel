import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

const VERSION = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA 
  ? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.substring(0, 7) 
  : 'dev'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [totalArticles, setTotalArticles] = useState(0)
  const [criticalCount, setCriticalCount] = useState(0)
  const [showCriticalOnly, setShowCriticalOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch('/api/data')
      if (!res.ok) throw new Error('Failed to fetch data')
      const data = await res.json()
      setArticles(data.articles || [])
      setLastUpdated(data.lastUpdated)
      setTotalArticles(data.totalArticles || 0)
      setCriticalCount(data.criticalCount || 0)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getScoreColor(score) {
    if (score >= 80) return '#ef4444'
    if (score >= 60) return '#f97316'
    if (score >= 40) return '#eab308'
    return '#22c55e'
  }

  const filteredArticles = articles.filter(article => {
    const matchesCritical = showCriticalOnly ? article.critical : true
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCritical && matchesSearch
  })

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>� Prophecy News Tracker</h1>
        <p className={styles.subtitle}>Tracking prophetic events worldwide</p>
        <span className={styles.version}>v{VERSION}</span>
      </header>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{totalArticles}</span>
          <span className={styles.statLabel}>Total Articles</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: '#ef4444' }}>{criticalCount}</span>
          <span className={styles.statLabel}>Critical Alerts</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{formatDate(lastUpdated)}</span>
          <span className={styles.statLabel}>Last Updated</span>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showCriticalOnly}
            onChange={(e) => setShowCriticalOnly(e.target.checked)}
          />
          <span>Critical Only</span>
        </label>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : (
        <div className={styles.articleList}>
          {filteredArticles.length === 0 ? (
            <p className={styles.noResults}>No articles found</p>
          ) : (
            filteredArticles.map((article, index) => (
              <a 
                key={index} 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.articleCard}
              >
                <div className={styles.articleHeader}>
                  <h3 className={styles.articleTitle}>{article.title}</h3>
                  {article.critical && <span className={styles.criticalBadge}>CRITICAL</span>}
                </div>
                <p className={styles.articleSummary}>{article.summary}</p>
                <div className={styles.articleMeta}>
                  <span className={styles.source}>{article.source}</span>
                  <span className={styles.date}>{formatDate(article.published)}</span>
                  <span 
                    className={styles.score}
                    style={{ backgroundColor: getScoreColor(article.score) }}
                  >
                    {article.score}
                  </span>
                </div>
                {article.categories && article.categories.length > 0 && (
                  <div className={styles.categories}>
                    {article.categories.map((cat, i) => (
                      <span key={i} className={styles.category}>{cat}</span>
                    ))}
                  </div>
                )}
              </a>
            ))
          )}
        </div>
      )}

      <footer className={styles.footer}>
        <p>Data synced from local Prophecy News Tracker</p>
      </footer>
    </div>
  )
}
