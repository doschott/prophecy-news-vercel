import { useState, useEffect, useRef } from 'react'
import { Chart } from 'chart.js'
import styles from '../styles/Home.module.css'

const VERSION = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA 
  ? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.substring(0, 7) 
  : 'dev'

export default function Trends() {
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
            grid: { color: '#1a1a2e' }
          },
          x: { 
            grid: { color: '#1a1a2e' }
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
            labels: { color: '#888', boxWidth: 12, padding: 8 }
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
            grid: { color: '#1a1a2e' }
          },
          x: { 
            grid: { display: false }
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
        <h1 className={styles.title}>📊 Prophecy Trends</h1>
        <p className={styles.subtitle}>Analytics and patterns from prophetic news</p>
        <span className={styles.version}>v{VERSION}</span>
      </header>

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
              <span className={styles.statValue} style={{ color: '#ef4444' }}>{trends.highRelevanceCount}</span>
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
      </footer>
    </div>
  )
}
