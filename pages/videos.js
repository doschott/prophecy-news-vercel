import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ThemeSelector } from '../components/ThemeSelector'
import styles from '../styles/Home.module.css'

const CATEGORIES = ['All', 'Economic', 'Technology', 'War', 'Israel', 'Mark of Beast']

export default function Videos() {
  const router = useRouter()
  const [videos, setVideos] = useState([])
  const [stats, setStats] = useState({ totalVideos: 0, prophecyVideos: 0, channelCount: 0, trendingCount: 0 })
  const [categoryDistribution, setCategoryDistribution] = useState({})
  const [sources, setSources] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchVideos()
  }, [selectedCategory])

  async function fetchVideos() {
    try {
      setLoading(true)
      const url = selectedCategory === 'All' 
        ? '/api/videos' 
        : `/api/videos?category=${selectedCategory.toLowerCase()}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch videos')
      const data = await res.json()
      setVideos(data.videos || [])
      setStats({
        totalVideos: data.totalVideos || 0,
        prophecyVideos: data.prophecyVideos || 0,
        channelCount: data.channelCount || 0,
        trendingCount: data.trendingCount || 0
      })
      setCategoryDistribution(data.categoryDistribution || {})
      setSources(data.sources || [])
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  function formatDuration(seconds) {
    if (!seconds) return '0:00'
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function formatViews(count) {
    if (!count) return '0'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  function getRelevanceColor(score) {
    if (score >= 0.8) return '#22c55e'
    if (score >= 0.6) return '#eab308'
    if (score >= 0.4) return '#f97316'
    return '#888'
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
        <h1 className={styles.title}>📺 Prophecy News Tracker</h1>
        <p className={styles.subtitle}>YouTube videos tracking prophetic events</p>
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
      </nav>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.totalVideos}</span>
          <span className={styles.statLabel}>Total Videos</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: 'var(--cyber-green)' }}>{stats.prophecyVideos}</span>
          <span className={styles.statLabel}>Prophecy Related</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.channelCount}</span>
          <span className={styles.statLabel}>Channels</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue} style={{ color: 'var(--cyber-hot)' }}>{stats.trendingCount}</span>
          <span className={styles.statLabel}>Trending</span>
        </div>
      </div>

      <div className={styles.categoryTabs}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`${styles.categoryTab} ${selectedCategory === cat ? styles.categoryTabActive : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading videos...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : (
        <>
          <div className={styles.videoSections}>
            {/* Video Sources Section */}
            <div className={styles.videoSection}>
              <h2 className={styles.videoSectionTitle}>📡 Video Sources</h2>
              <div className={styles.sourceList}>
                {sources.length > 0 ? (
                  sources.map((source, idx) => (
                    <div key={idx} className={styles.sourceItem}>
                      <span className={styles.sourceName}>{source.name}</span>
                      <span className={styles.sourceCount}>{source.count} videos</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.noResults}>No source data</p>
                )}
              </div>
            </div>

            {/* Video Categories Section */}
            <div className={styles.videoSection}>
              <h2 className={styles.videoSectionTitle}>📊 Video Categories</h2>
              <div className={styles.categoryList}>
                {Object.keys(categoryDistribution).length > 0 ? (
                  Object.entries(categoryDistribution).map(([cat, count]) => (
                    <div key={cat} className={styles.categoryItem}>
                      <span className={styles.categoryName}>{cat}</span>
                      <span className={styles.categoryCount}>{count}</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.noResults}>No category data</p>
                )}
              </div>
            </div>
          </div>

          {videos.length === 0 ? (
            <div className={styles.noResults}>No videos found</div>
          ) : (
            <div className={styles.videoGrid}>
          {videos.map((video, index) => (
            <a
              key={index}
              href={video.video_url || `https://youtube.com/watch?v=${video.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.videoCard}
            >
              <div className={styles.videoThumbnail}>
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt={video.title} />
                ) : (
                  <div className={styles.videoThumbPlaceholder}>
                    <span>▶</span>
                  </div>
                )}
                <span className={styles.videoDuration}>{formatDuration(video.duration_seconds)}</span>
                {video.is_trending && <span className={styles.videoTrending}>🔥 TRENDING</span>}
              </div>
              <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{video.title}</h3>
                <p className={styles.videoChannel}>{video.channel_name}</p>
                <div className={styles.videoMeta}>
                  <span className={styles.videoViews}>{formatViews(video.view_count)} views</span>
                  <span className={styles.videoDate}>{formatDate(video.published_at)}</span>
                  {video.relevance_score !== undefined && video.relevance_score !== null && (
                    <span 
                      className={styles.videoRelevance}
                      style={{ backgroundColor: getRelevanceColor(video.relevance_score) }}
                    >
                      {(video.relevance_score * 100).toFixed(0)}% relevant
                    </span>
                  )}
                </div>
                {video.video_category && (
                  <span className={styles.videoCategory}>{video.video_category}</span>
                )}
              </div>
            </a>
          ))}
        </div>
          )}
        </>
      )}

      <footer className={styles.footer}>
        <p>Video data synced from local Prophecy News Tracker</p>
      </footer>
    </div>
  )
}
