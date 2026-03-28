import '../styles/globals.css'
import { Chart, registerables } from 'chart.js'

// Register all Chart.js components
Chart.register(...registerables)

// Set global chart defaults for dark theme
Chart.defaults.color = '#888'
Chart.defaults.borderColor = '#1a1a2e'
Chart.defaults.backgroundColor = '#12121a'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
