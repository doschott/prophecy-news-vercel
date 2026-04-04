import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ThemeSelector } from '../components/ThemeSelector'
import styles from '../styles/Home.module.css'

const VERSION = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
  ? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.substring(0, 7)
  : 'dev'

export default function Theology() {
  const router = useRouter()
  const [theologians, setTheologians] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Quote rotation state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [fadeState, setFadeState] = useState('in') // 'in' | 'out'

  // Expanded theologian state
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch('/api/theologians')
      if (!res.ok) throw new Error('Failed to fetch theologians')
      const data = await res.json()
      setTheologians(data.theologians || [])
      setLastUpdated(data.lastUpdated)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Rotate quotes every 8 seconds
  useEffect(() => {
    if (theologians.length === 0) return

    const interval = setInterval(() => {
      setFadeState('out')
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % theologians.length)
        setFadeState('in')
      }, 500)
    }, 8000)

    return () => clearInterval(interval)
  }, [theologians.length])

  const toggleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  if (loading) {
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
          <p className={styles.subtitle}>Tracking prophetic events worldwide</p>
          
        </header>
        <nav className={styles.tabs}>
          <Link href="/" className={`${styles.tab} ${router.pathname === '/' ? styles.tabActive : ''}`}>📊 Trends</Link>
          <Link href="/news" className={`${styles.tab} ${router.pathname === '/news' ? styles.tabActive : ''}`}>📰 News</Link>
          <Link href="/videos" className={`${styles.tab} ${router.pathname === '/videos' ? styles.tabActive : ''}`}>📺 Videos</Link>
          <Link href="/theology" className={`${styles.tab} ${router.pathname === '/theology' ? styles.tabActive : ''}`}>📖 Theology</Link>
          <Link href="/archive" className={`${styles.tab} ${router.pathname === '/archive' ? styles.tabActive : ''}`}>📚 Archive</Link>
        </nav>
        <div className={styles.loading}>Loading theologian data...</div>
      </div>
    )
  }

  const currentTheologian = theologians[currentQuoteIndex] || {}

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
        <p className={styles.subtitle}>Supporting Theologians & Prophecy Scholars</p>
        
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

      {/* Rotating Quote Banner */}
      <div className="theologyQuoteBanner">
        <div className="theologyQuoteIcon">&ldquo;</div>
        <blockquote
          className="theologyQuoteText"
          style={{
            opacity: fadeState === 'in' ? 1 : 0,
            transition: 'opacity 0.5s ease'
          }}
        >
          {currentTheologian.quote || 'Loading wisdom from prophecy scholars...'}
        </blockquote>
        <cite className="theologyQuoteAuthor">
          — {currentTheologian.name}, <span>{currentTheologian.full_name}</span>
        </cite>
        {lastUpdated && (
          <span className="theologyQuoteUpdated">
            Data synced: {new Date(lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <div className="theologyQuoteDots">
          {theologians.map((t, i) => (
            <span
              key={t.id}
              className={`theologyQuoteDot ${i === currentQuoteIndex ? 'active' : ''}`}
              onClick={() => {
                setFadeState('out')
                setTimeout(() => {
                  setCurrentQuoteIndex(i)
                  setFadeState('in')
                }, 300)
              }}
            />
          ))}
        </div>
      </div>

      {/* Theologian Cards Grid */}
      {error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : (
        <>
          <div className="theologySectionHeader">
            <h2 className="theologySectionTitle">Featured Prophecy Scholars</h2>
            <p className="theologySectionSubtitle">
              Key theologians who shaped modern dispensational eschatology
            </p>
          </div>

          <div className="theologyCardGrid">
            {theologians.map((theologian) => (
              <div key={theologian.id} className="theologyCard">
                <div className="theologyCardHeader">
                  <div className="theologyCardAvatar">
                    {theologian.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div className="theologyCardIdentity">
                    <h3 className="theologyCardName">{theologian.name}</h3>
                    <p className="theologyCardFullName">{theologian.full_name}</p>
                  </div>
                </div>
                <p className="theologyCardDescription">{theologian.description}</p>
                <div className="theologyCardBeliefs">
                  {theologian.key_beliefs && theologian.key_beliefs.map((belief, i) => (
                    <span key={i} className="theologyBeliefTag">{belief}</span>
                  ))}
                </div>
                <button
                  className="theologyCardExpand"
                  onClick={() => toggleExpand(theologian.id)}
                >
                  {expandedId === theologian.id ? '▲ Hide Details' : '▼ View Details'}
                </button>

                {/* Expanded Details */}
                {expandedId === theologian.id && (
                  <div className="theologyCardDetails">
                    <div className="theologyDetailRow">
                      <span className="theologyDetailLabel">🎓 Education</span>
                      <span className="theologyDetailValue">{theologian.education}</span>
                    </div>
                    <div className="theologyDetailRow">
                      <span className="theologyDetailLabel">💡 Distinctives</span>
                      <span className="theologyDetailValue">{theologian.distinctives}</span>
                    </div>
                    <div className="theologyDetailRow">
                      <span className="theologyDetailLabel">📚 Notable Works</span>
                      <span className="theologyDetailValue">
                        {theologian.notable_works && theologian.notable_works.join(' • ')}
                      </span>
                    </div>
                    <div className="theologyDetailQuote">
                      <span className="theologyDetailLabel">&ldquo; Quote</span>
                      <blockquote className="theologyDetailQuoteText">
                        {theologian.quote}
                      </blockquote>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <footer className={styles.footer}>
        <p>Theological data synced from local Prophecy News Tracker</p>
        <p className={styles.version}>v{VERSION}</p>
      </footer>

      {/* Theology page styles */}
      <style jsx>{`
        /* Rotating Quote Banner */
        .theologyQuoteBanner {
          background: var(--cyber-card);
          border: 1px solid var(--cyber-border);
          border-left: 4px solid var(--cyber-cyan);
          border-radius: 8px;
          padding: 2.5rem 2rem;
          margin-bottom: 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.1), inset 0 0 30px rgba(0, 240, 255, 0.03);
        }

        .theologyQuoteBanner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--cyber-cyan), transparent);
        }

        .theologyQuoteIcon {
          font-size: 5rem;
          color: var(--cyber-cyan);
          opacity: 0.15;
          line-height: 1;
          margin-bottom: -2rem;
          font-family: Georgia, serif;
        }

        .theologyQuoteText {
          font-size: 1.4rem;
          font-style: italic;
          color: var(--cyber-text);
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto 1.5rem;
          text-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
        }

        .theologyQuoteAuthor {
          display: block;
          color: var(--cyber-cyan);
          font-size: 1rem;
          font-style: normal;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .theologyQuoteAuthor span {
          color: var(--cyber-text-dim);
          font-size: 0.85rem;
        }

        .theologyQuoteUpdated {
          display: block;
          color: var(--cyber-text-muted);
          font-size: 0.7rem;
          margin-top: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .theologyQuoteDots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        .theologyQuoteDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--cyber-border);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .theologyQuoteDot:hover {
          background: var(--cyber-text-dim);
        }

        .theologyQuoteDot.active {
          background: var(--cyber-cyan);
          box-shadow: 0 0 8px var(--cyber-cyan);
          transform: scale(1.3);
        }

        /* Section Header */
        .theologySectionHeader {
          text-align: center;
          margin-bottom: 2rem;
        }

        .theologySectionTitle {
          font-size: 1.5rem;
          color: var(--cyber-text);
          text-transform: uppercase;
          letter-spacing: 3px;
          text-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
          margin-bottom: 0.5rem;
        }

        .theologySectionSubtitle {
          color: var(--cyber-text-dim);
          font-size: 0.9rem;
          letter-spacing: 1px;
        }

        /* Theologian Cards Grid */
        .theologyCardGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        @media (max-width: 1024px) {
          .theologyCardGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .theologyCardGrid {
            grid-template-columns: 1fr;
          }
        }

        /* Individual Theologian Card */
        .theologyCard {
          background: var(--cyber-card);
          border: 1px solid var(--cyber-border);
          border-radius: 8px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .theologyCard::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--cyber-cyan), var(--cyber-magenta));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .theologyCard:hover {
          border-color: var(--cyber-cyan);
          transform: translateY(-3px);
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.15), 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .theologyCard:hover::before {
          opacity: 1;
        }

        .theologyCardHeader {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .theologyCardAvatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--cyber-cyan) 0%, var(--cyber-magenta) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: bold;
          color: #fff;
          flex-shrink: 0;
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
          font-family: 'Courier New', monospace;
        }

        .theologyCardIdentity {
          flex: 1;
          min-width: 0;
        }

        .theologyCardName {
          font-size: 1.1rem;
          color: var(--cyber-text);
          margin: 0 0 0.25rem;
          font-weight: 600;
        }

        .theologyCardFullName {
          font-size: 0.75rem;
          color: var(--cyber-text-dim);
          margin: 0;
          font-family: 'Courier New', monospace;
        }

        .theologyCardDescription {
          color: var(--cyber-text-dim);
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .theologyCardBeliefs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .theologyBeliefTag {
          background: rgba(0, 240, 255, 0.08);
          color: var(--cyber-cyan);
          font-size: 0.65rem;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          border: 1px solid rgba(0, 240, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .theologyCardExpand {
          width: 100%;
          padding: 0.6rem;
          background: transparent;
          border: 1px solid var(--cyber-border);
          border-radius: 4px;
          color: var(--cyber-text-dim);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .theologyCardExpand:hover {
          border-color: var(--cyber-cyan);
          color: var(--cyber-cyan);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
        }

        /* Expanded Details */
        .theologyCardDetails {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--cyber-border);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .theologyDetailRow {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .theologyDetailLabel {
          font-size: 0.65rem;
          color: var(--cyber-text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: bold;
        }

        .theologyDetailValue {
          font-size: 0.8rem;
          color: var(--cyber-text-dim);
          line-height: 1.4;
        }

        .theologyDetailQuote {
          background: rgba(0, 0, 0, 0.3);
          border-left: 2px solid var(--cyber-magenta);
          padding: 0.75rem;
          border-radius: 0 4px 4px 0;
        }

        .theologyDetailQuoteText {
          font-size: 0.8rem;
          font-style: italic;
          color: var(--cyber-text-dim);
          line-height: 1.5;
          margin: 0.25rem 0 0;
        }
      `}</style>
    </div>
  )
}
