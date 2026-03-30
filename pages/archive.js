import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ThemeSelector } from '../components/ThemeSelector'
import styles from '../styles/Home.module.css'

const TRUST_LEVELS = ['all', 'trusted', 'reliable', 'questionable', 'unreliable']

export default function Archive() {
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [trustLevel, setTrustLevel] = useState('all')
  const [minRelevance, setMinRelevance] = useState('')
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 20

  useEffect(() => {
    fetchArchive()
  }, [page])

  async function fetchArchive() {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      if (trustLevel && trustLevel !== 'all') params.append('trustLevel', trustLevel)
      if (minRelevance) params.append('minRelevance', minRelevance)
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      
      const res = await fetch(`/api/archive?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch archive')
      
      const data = await res.json()
      setArticles(data.articles || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    fetchArchive()
  }

  function handleReset() {
    setSearchQuery('')
    setStartDate('')
    setEndDate('')
    setTrustLevel('all')
    setMinRelevance('')
    setPage(1)
    fetchArchive()
  }

  function exportToCSV() {
    if (articles.length === 0) return
    
    const headers = ['Title', 'Source', 'Published', 'Summary', 'Relevance Score', 'Trust Level', 'URL']
    const rows = articles.map(a => [
      (a.title || '').replace(/"/g, '""'),
      a.source || '',
      a.published_at || a.published || '',
      (a.summary || '').replace(/"/g, '""'),
      a.relevance_score || a.score || '',
      a.trust_level || '',
      a.url || a.source_url || ''
    ])
    
    const csv = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `archive-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  function exportToJSON() {
    if (articles.length === 0) return
    const data = JSON.stringify(articles, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `archive-export-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getScoreColor(score) {
    const s = score || 0
    if (s >= 80) return '#ef4444'
    if (s >= 60) return '#f97316'
    if (s >= 40) return '#eab308'
    return '#22c55e'
  }

  function getTrustLevelColor(level) {
    switch ((level || '').toLowerCase()) {
      case 'trusted': return '#22c55e'
      case 'reliable': return '#3b82f6'
      case 'questionable': return '#eab308'
      case 'unreliable': return '#ef4444'
      default: return '#888'
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.themeSelectorWrapper}>
            <span className={styles.themeLabel}>Theme</span>
            <ThemeSelector />
          </div>
        </div>
        <h1 className={styles.title}>📖 EndTimesHub.com</h1>
        <p className={styles.subtitle}>Search through all historical articles</p>
      </header>

      <nav className={styles.tabs}>
        <Link href="/" className={`${styles.tab} ${router.pathname === '/' ? styles.tabActive : ''}`}>
          📰 Dashboard
        </Link>
        <Link href="/trends" className={`${styles.tab} ${router.pathname === '/trends' ? styles.tabActive : ''}`}>
          📊 Trends
        </Link>
        <Link href="/videos" className={`${styles.tab} ${router.pathname === '/videos' ? styles.tabActive : ''}`}>
          📺 Videos
        </Link>
        <Link href="/theology" className={`${styles.tab} ${router.pathname === '/theology' ? styles.tabActive : ''}`}>
          📖 Theology
        </Link>
        <Link href="/archive" className={`${styles.tab} ${router.pathname === '/archive' ? styles.tabActive : ''}`}>
          📚 Archive
        </Link>
      </nav>

      {/* Search Filters */}
      <form onSubmit={handleSearch} className={styles.archiveFilters}>
        <div className={styles.filterRow}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            style={{ flex: 2 }}
          />
          <button type="submit" className={styles.filterButton}>
            🔍 Search
          </button>
          <button type="button" onClick={handleReset} className={styles.filterButtonSecondary}>
            Reset
          </button>
        </div>
        
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label>From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Trust Level</label>
            <select
              value={trustLevel}
              onChange={(e) => setTrustLevel(e.target.value)}
              className={styles.selectInput}
            >
              {TRUST_LEVELS.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Min Relevance</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              placeholder="0.0"
              value={minRelevance}
              onChange={(e) => setMinRelevance(e.target.value)}
              className={styles.numberInput}
            />
          </div>
        </div>
      </form>

      {/* Results Count */}
      {!loading && !error && (
        <div className={styles.resultsInfo}>
          <span>{total} articles found</span>
          {totalPages > 1 && (
            <span>Page {page} of {totalPages}</span>
          )}
          {articles.length > 0 && (
            <div className={styles.exportButtons}>
              <button onClick={exportToCSV} className={styles.exportButton}>📥 CSV</button>
              <button onClick={exportToJSON} className={styles.exportButton}>📥 JSON</button>
            </div>
          )}
        </div>
      )}

      {/* Loading/Error States */}
      {loading && (
        <div className={styles.loading}>Searching archive...</div>
      )}
      
      {error && (
        <div className={styles.error}>Error: {error}</div>
      )}

      {/* Article Grid */}
      {!loading && !error && (
        <>
          {articles.length === 0 ? (
            <div className={styles.noResults}>
              {total === 0 ? 'No articles found. Try adjusting your filters.' : 'No articles on this page.'}
            </div>
          ) : (
            <div className={styles.articleList}>
              {articles.map((article, index) => (
                <a
                  key={index}
                  href={article.url || article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.articleCard}
                >
                  <div className={styles.articleHeader}>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                    {article.critical && (
                      <span className={styles.criticalBadge}>CRITICAL</span>
                    )}
                  </div>
                  <p className={styles.articleSummary}>{article.summary}</p>
                  <div className={styles.articleMeta}>
                    <span className={styles.source}>{article.source || 'Unknown'}</span>
                    <span className={styles.date}>{formatDate(article.published_at || article.published)}</span>
                    {(article.relevance_score || article.score) && (
                      <span
                        className={styles.score}
                        style={{ backgroundColor: getScoreColor(article.relevance_score || article.score) }}
                      >
                        {((article.relevance_score || article.score) * 100).toFixed(0)}
                      </span>
                    )}
                    {article.trust_level && (
                      <span
                        className={styles.trustBadge}
                        style={{ backgroundColor: getTrustLevelColor(article.trust_level) }}
                      >
                        {article.trust_level}
                      </span>
                    )}
                  </div>
                  {article.categories && article.categories.length > 0 && (
                    <div className={styles.categories}>
                      {article.categories.map((cat, i) => (
                        <span key={i} className={styles.category}>{cat}</span>
                      ))}
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={styles.paginationBtn}
              >
                ← Previous
              </button>
              <span className={styles.paginationInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={styles.paginationBtn}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      <footer className={styles.footer}>
        <p>Data synced from local Prophecy News Tracker</p>
      </footer>
    </div>
  )
}