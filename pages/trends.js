import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Chart } from 'chart.js'
import { ThemeSelector } from '../components/ThemeSelector'
import styles from '../styles/Home.module.css'

const VERSION = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA 
  ? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.substring(0, 7) 
  : 'dev'

// Prophecy Timeline Data (Dispensational, Pretribulational, Premillennial)
const TIMELINE_EVENTS = [
  // === FULFILLED: OLD TESTAMENT ===
  { id: 'ot-1', era: 'ot', period: 'Creation', year: '~4000 BC', fulfilled: true, icon: '🌍', description: 'God creates heavens and earth', scriptures: ['Genesis 1:1'] },
  { id: 'ot-2', era: 'ot', period: 'Abrahamic Covenant', year: '~2000 BC', fulfilled: true, icon: '✡️', description: 'God promises land and blessings to Abraham\'s descendants', scriptures: ['Genesis 12:1-3', 'Genesis 15:18'] },
  { id: 'ot-3', era: 'ot', period: 'Moses & Exodus', year: '~1446 BC', fulfilled: true, icon: '🔥', description: 'Delivered from Egypt, Law given at Sinai', scriptures: ['Exodus 3:10', 'Exodus 19-20'] },
  { id: 'ot-4', era: 'ot', period: 'Temple Built', year: '~957 BC', fulfilled: true, icon: '⛪', description: 'Solomon builds the First Temple in Jerusalem', scriptures: ['1 Kings 6:1'] },
  { id: 'ot-5', era: 'ot', period: 'Prophets Warn', year: '700-400 BC', fulfilled: true, icon: '📜', description: 'Major and minor prophets declare coming Messiah and tribulation', scriptures: ['Isaiah 53', 'Daniel 9:24-27', 'Ezekiel 38-39'] },
  
  // === FULFILLED: NEW TESTAMENT ===
  { id: 'nt-1', era: 'nt', period: 'Birth of Christ', year: '~4 BC', fulfilled: true, icon: '⭐', description: 'Messiah born in Bethlehem', scriptures: ['Micah 5:2', 'Luke 2:1-20'] },
  { id: 'nt-2', era: 'nt', period: 'Jesus\' Ministry', year: '27-30 AD', fulfilled: true, icon: '✝️', description: 'Christ preaches the Kingdom, performs miracles', scriptures: ['Isaiah 61:1-2', 'Luke 4:18-21'] },
  { id: 'nt-3', era: 'nt', period: 'Crucifixion & Resurrection', year: '30 AD', fulfilled: true, icon: '💔', description: 'Christ dies for sins, rises on third day', scriptures: ['Isaiah 53:5-12', '1 Peter 2:24', 'Romans 4:25'] },
  { id: 'nt-4', era: 'nt', period: 'Pentecost', year: '33 AD', fulfilled: true, icon: '🔥', description: 'Holy Spirit descends, Church Age begins', scriptures: ['Acts 2:1-4'] },
  { id: 'nt-5', era: 'nt', period: 'St. Thomas in India', year: '52 AD', fulfilled: true, icon: '✝️', description: 'Gospel reaches India via Thomas', scriptures: ['John 21:25'] },
  
  // === FULFILLED: MODERN ERA ===
  { id: 'mod-1', era: 'modern', period: 'Israel Reborn', year: '1948', fulfilled: true, icon: '🇮🇱', description: 'State of Israel reestablished after 2000 years', scriptures: ['Ezekiel 36-37', 'Isaiah 66:7-8'] },
  { id: 'mod-2', era: 'modern', period: 'Jerusalem Restored', year: '1967', fulfilled: true, icon: '🏛️', description: 'Jerusalem reunified under Israeli control during Six-Day War', scriptures: ['Luke 21:24', 'Zechariah 12:3'] },
  { id: 'mod-3', era: 'modern', period: 'Temple Institute Active', year: '2019+', fulfilled: true, icon: '🕯️', description: 'Third Temple preparations underway in Jerusalem', scriptures: ['Daniel 9:27', 'Matthew 24:15-16'] },
  
  // === FUTURE: TRIBULATION (Unfulfilled) ===
  { id: 'fut-1', era: 'trib', period: 'Rapture', year: 'Any Moment', fulfilled: false, icon: '☁️', description: 'Church caught up to meet Christ in the air', scriptures: ['1 Thessalonians 4:16-17', 'John 14:1-3'] },
  { id: 'fut-2', era: 'trib', period: 'Tribulation Begins', year: 'T+0', fulfilled: false, icon: '⏳', description: '7-year tribulation begins; Antichrist revealed', scriptures: ['Daniel 9:27', '2 Thessalonians 2:3-4'] },
  { id: 'fut-3', era: 'trib', period: 'Abomination of Desolation', year: 'T+3.5 yrs', fulfilled: false, icon: '💀', description: 'Antichrist defiles the Temple, demands worship', scriptures: ['Daniel 9:27', 'Matthew 24:15-16', '2 Thessalonians 2:4'] },
  { id: 'fut-4', era: 'trib', period: 'False Prophet', year: 'T+3.5 yrs', fulfilled: false, icon: '🎭', description: 'Global false religious system arises', scriptures: ['Revelation 13:11-18', '2 Thessalonians 2:9-12'] },
  { id: 'fut-5', era: 'trib', period: 'Global Currency', year: 'T+3.5 yrs', fulfilled: false, icon: '💳', description: 'Mark of the Beast system implemented', scriptures: ['Revelation 13:16-18'] },
  { id: 'fut-6', era: 'trib', period: 'Battle of Armageddon', year: 'T+7 yrs', fulfilled: false, icon: '⚔️', description: 'Nations gather against Israel at Megiddo', scriptures: ['Revelation 16:13-16', 'Zechariah 14:1-4'] },
  
  // === FUTURE: MILLENNIAL & BEYOND ===
  { id: 'mil-1', era: 'mill', period: 'Second Coming', year: 'T+7 yrs', fulfilled: false, icon: '🌍', description: 'Christ returns to earth with His saints to establish Kingdom', scriptures: ['Zechariah 14:4-9', 'Matthew 24:29-31', 'Revelation 19:11-16'] },
  { id: 'mil-2', era: 'mill', period: 'Millennial Kingdom', year: 'T+7 yrs', fulfilled: false, icon: '👑', description: '1,000-year reign of Christ on earth from Jerusalem', scriptures: ['Isaiah 9:6-7', 'Micah 4:1-4', 'Revelation 20:4-6'] },
  { id: 'mil-3', era: 'mill', period: 'Satan Released', year: 'T+1000 yrs', fulfilled: false, icon: '🐍', description: 'Final rebellion after millennium', scriptures: ['Revelation 20:7-10'] },
  { id: 'mil-4', era: 'mill', period: 'Great White Throne', year: 'T+1000 yrs', fulfilled: false, icon: '⚖️', description: 'Final judgment of the wicked', scriptures: ['Revelation 20:11-15'] },
  { id: 'mil-5', era: 'mill', period: 'New Heaven & Earth', year: 'Post-Mill', fulfilled: false, icon: '✨', description: 'Eternal state; God dwells with His people', scriptures: ['Revelation 21:1-4', 'Isaiah 65:17', '2 Peter 3:13'] },
]

export default function Trends() {
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [totalArticles, setTotalArticles] = useState(0)
  const [criticalCount, setCriticalCount] = useState(0)
  const [period, setPeriod] = useState(7)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const lineChartRef = useRef(null)
  const pieChartRef = useRef(null)
  const barChartRef = useRef(null)
  const lineChartInstance = useRef(null)
  const pieChartInstance = useRef(null)
  const barChartInstance = useRef(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (articles.length > 0 && lineChartRef.current && pieChartRef.current && barChartRef.current) {
      renderCharts()
    }
    return () => {
      destroyCharts()
    }
  }, [articles, period])

  async function fetchData() {
    try {
      const res = await fetch('/api/data')
      if (!res.ok) throw new Error('Failed to fetch data')
      const data = await res.json()
      setArticles(data.articles || [])
      setTotalArticles(data.totalArticles || 0)
      setCriticalCount(data.criticalCount || 0)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  function computeTrends(articles, days) {
    const now = new Date()
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    
    // Filter articles by period
    const filtered = articles.filter(a => {
      const date = new Date(a.published_at || a.published || a.date)
      return date >= cutoff
    })

    // Daily activity counts
    const dailyCounts = {}
    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000)
      const key = date.toISOString().split('T')[0]
      dailyCounts[key] = 0
    }
    
    filtered.forEach(a => {
      const date = new Date(a.published_at || a.published || a.date)
      const key = date.toISOString().split('T')[0]
      if (dailyCounts[key] !== undefined) {
        dailyCounts[key]++
      }
    })

    // Category distribution (from categories array or source-based fallback)
    const categoryCounts = {}
    filtered.forEach(a => {
      if (a.categories && a.categories.length > 0) {
        a.categories.forEach(cat => {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
        })
      } else {
        const cat = a.source || 'Unknown'
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
      }
    })

    // Relevance distribution
    const relevanceBuckets = {
      'Critical (80-100)': 0,
      'High (60-80)': 0,
      'Medium (40-60)': 0,
      'Low (0-40)': 0
    }
    
    filtered.forEach(a => {
      const score = (a.relevance_score || a.score || 0) * 100
      if (score >= 80) relevanceBuckets['Critical (80-100)']++
      else if (score >= 60) relevanceBuckets['High (60-80)']++
      else if (score >= 40) relevanceBuckets['Medium (40-60)']++
      else relevanceBuckets['Low (0-40)']++
    })

    // High relevance count
    const highRelevanceCount = filtered.filter(a => (a.relevance_score || a.score || 0) >= 0.7).length

    // Average relevance score
    const avgScore = filtered.length > 0 
      ? (filtered.reduce((sum, a) => sum + (a.relevance_score || a.score || 0), 0) / filtered.length * 100).toFixed(1)
      : 0

    return {
      dailyCounts,
      categoryCounts,
      relevanceBuckets,
      highRelevanceCount,
      avgScore,
      periodTotal: filtered.length
    }
  }

  function renderCharts() {
    const trends = computeTrends(articles, period)

    // Destroy existing charts
    destroyCharts()

    // Line Chart - Daily Activity
    const lineCtx = lineChartRef.current.getContext('2d')
    lineChartInstance.current = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: Object.keys(trends.dailyCounts).map(d => {
          const date = new Date(d)
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }),
        datasets: [{
          label: 'Articles',
          data: Object.values(trends.dailyCounts),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { 
            beginAtZero: true,
            grid: { color: 'var(--cyber-border)' },
            ticks: { color: '#ffffff' }
          },
          x: { 
            grid: { color: 'var(--cyber-border)' },
            ticks: { color: '#ffffff' }
          }
        }
      }
    })

    // Pie Chart - Category Distribution
    const pieCtx = pieChartRef.current.getContext('2d')
    const categoryEntries = Object.entries(trends.categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    const pieColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6']
    
    pieChartInstance.current = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: categoryEntries.map(([k]) => k.length > 15 ? k.substring(0, 15) + '...' : k),
        datasets: [{
          data: categoryEntries.map(([, v]) => v),
          backgroundColor: pieColors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#ffffff', boxWidth: 12, padding: 8 }
          }
        }
      }
    })

    // Bar Chart - Relevance Distribution
    const barCtx = barChartRef.current.getContext('2d')
    const barColors = ['#ef4444', '#f97316', '#eab308', '#22c55e']
    
    barChartInstance.current = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(trends.relevanceBuckets),
        datasets: [{
          label: 'Articles',
          data: Object.values(trends.relevanceBuckets),
          backgroundColor: barColors,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { 
            beginAtZero: true,
            grid: { color: 'var(--cyber-border)' },
            ticks: { color: '#ffffff' }
          },
          x: { 
            grid: { display: false },
            ticks: { color: '#ffffff' }
          }
        }
      }
    })
  }

  function destroyCharts() {
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy()
      lineChartInstance.current = null
    }
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy()
      pieChartInstance.current = null
    }
    if (barChartInstance.current) {
      barChartInstance.current.destroy()
      barChartInstance.current = null
    }
  }

  const trends = computeTrends(articles, period)

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
        <p className={styles.subtitle}>Analytics and patterns from prophetic news</p>
        
      </header>

      <nav className={styles.tabs}>
        <Link href="/" className={`${styles.tab} ${router.pathname === '/' ? styles.tabActive : ''}`}>
          📊 Trends
        </Link>
        <Link href="/news" className={`${styles.tab} ${router.pathname === '/news' ? styles.tabActive : ''}`}>
          📰 News
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

      <div className={styles.controls}>
        <div className={styles.periodSelector}>
          <span className={styles.periodLabel}>Time Period:</span>
          {[7, 14, 30].map(p => (
            <button
              key={p}
              className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p} Days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : (
        <>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{trends.periodTotal}</span>
              <span className={styles.statLabel}>Articles ({period}d)</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue} style={{ color: 'var(--cyber-hot)' }}>{trends.highRelevanceCount}</span>
              <span className={styles.statLabel}>High Relevance</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{trends.avgScore}%</span>
              <span className={styles.statLabel}>Avg Relevance</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{criticalCount}</span>
              <span className={styles.statLabel}>Critical Alerts</span>
            </div>
          </div>

          {/* Prophecy Timeline Card */}
          <div className={styles.timelineCard}>
            <div className={styles.timelineHeader}>
              <h2 className={styles.timelineTitle}>📅 Prophecy Timeline — Where Are We?</h2>
              <p className={styles.timelineSubtitle}>Biblical prophecy from creation to eternity</p>
            </div>
            
            <div className={styles.timeline}>
              {/* FULFILLED: OLD TESTAMENT */}
              <div className={styles.timelineDivider}>
                <span className={styles.timelineDividerLabel}>⬆️ BEFORE — Fulfilled Prophecies</span>
              </div>
              
              <div className={styles.timelineSection}>
                <div className={styles.timelineSectionLabel}>Old Testament</div>
                {TIMELINE_EVENTS.filter(e => e.era === 'ot').map((event) => (
                  <div key={event.id} className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.timelineIcon}>{event.icon}</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelinePeriod}>{event.period}</div>
                      <div className={styles.timelineYear}>{event.year}</div>
                      <div className={styles.timelineDescription}>{event.description}</div>
                      <div className={styles.timelineScriptures}>
                        {event.scriptures.map((ref, i) => (
                          <span key={i} className={styles.timelineScripture}>{ref}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.timelineSection}>
                <div className={styles.timelineSectionLabel}>New Testament</div>
                {TIMELINE_EVENTS.filter(e => e.era === 'nt').map((event) => (
                  <div key={event.id} className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.timelineIcon}>{event.icon}</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelinePeriod}>{event.period}</div>
                      <div className={styles.timelineYear}>{event.year}</div>
                      <div className={styles.timelineDescription}>{event.description}</div>
                      <div className={styles.timelineScriptures}>
                        {event.scriptures.map((ref, i) => (
                          <span key={i} className={styles.timelineScripture}>{ref}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.timelineSection}>
                <div className={styles.timelineSectionLabel}>Modern Era</div>
                {TIMELINE_EVENTS.filter(e => e.era === 'modern').map((event) => (
                  <div key={event.id} className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.timelineIcon}>{event.icon}</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelinePeriod}>{event.period}</div>
                      <div className={styles.timelineYear}>{event.year}</div>
                      <div className={styles.timelineDescription}>{event.description}</div>
                      <div className={styles.timelineScriptures}>
                        {event.scriptures.map((ref, i) => (
                          <span key={i} className={styles.timelineScripture}>{ref}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WE ARE HERE */}
              <div className={styles.timelineHere}>
                <div className={styles.timelineHereLine}></div>
                <div className={styles.timelineHereMarker}>
                  <span className={styles.timelineHereIcon}>🟢</span>
                  <span className={styles.timelineHereText}>YOU ARE HERE</span>
                </div>
                <div className={styles.timelineHereLine}></div>
              </div>
              <div className={styles.timelineHereLabel}>
                Church Age — The Late Season (Pretribulation Rapture Awaited)
              </div>

              {/* FUTURE: UNFULFILLED */}
              <div className={styles.timelineDivider}>
                <span className={styles.timelineDividerLabel}>⬇️ FUTURE — Unfulfilled Prophecies</span>
              </div>

              <div className={styles.timelineSection}>
                <div className={styles.timelineSectionLabel}>Tribulation (7 Years)</div>
                {TIMELINE_EVENTS.filter(e => e.era === 'trib').map((event) => (
                  <div key={event.id} className={`${styles.timelineItem} ${styles.timelineItemFuture}`}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.timelineIcon}>{event.icon}</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelinePeriod}>{event.period}</div>
                      <div className={styles.timelineYear}>{event.year}</div>
                      <div className={styles.timelineDescription}>{event.description}</div>
                      <div className={styles.timelineScriptures}>
                        {event.scriptures.map((ref, i) => (
                          <span key={i} className={styles.timelineScripture}>{ref}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.timelineSection}>
                <div className={styles.timelineSectionLabel}>Millennial & Eternal</div>
                {TIMELINE_EVENTS.filter(e => e.era === 'mill').map((event) => (
                  <div key={event.id} className={`${styles.timelineItem} ${styles.timelineItemFuture}`}>
                    <div className={styles.timelineMarker}>
                      <span className={styles.timelineIcon}>{event.icon}</span>
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelinePeriod}>{event.period}</div>
                      <div className={styles.timelineYear}>{event.year}</div>
                      <div className={styles.timelineDescription}>{event.description}</div>
                      <div className={styles.timelineScriptures}>
                        {event.scriptures.map((ref, i) => (
                          <span key={i} className={styles.timelineScripture}>{ref}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.chartSection}>
            <h2 className={styles.chartTitle}>Daily Activity</h2>
            <div className={styles.chartContainer}>
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>

          <div className={styles.chartGrid}>
            <div className={styles.chartSection}>
              <h2 className={styles.chartTitle}>Category Distribution</h2>
              <div className={styles.chartContainer}>
                <canvas ref={pieChartRef}></canvas>
              </div>
            </div>
            <div className={styles.chartSection}>
              <h2 className={styles.chartTitle}>Relevance Distribution</h2>
              <div className={styles.chartContainer}>
                <canvas ref={barChartRef}></canvas>
              </div>
            </div>
          </div>
        </>
      )}

      <footer className={styles.footer}>
        <p>Data synced from local Prophecy News Tracker</p>
        <p className={styles.version}>v{VERSION}</p>
      </footer>
    </div>
  )
}
