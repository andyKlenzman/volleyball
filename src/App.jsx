// ABOUTME: Root application component for the volleyball serve tracker
// ABOUTME: Manages player roster, team settings, brand colors, and top-level navigation
import { useState, useEffect } from 'react'
import AddPlayer from './components/AddPlayer.jsx'
import ServeEntry from './components/ServeEntry.jsx'
import Admin from './components/Admin.jsx'
import About from './components/About.jsx'
import { loadPlayers, loadSettings } from './storage.js'

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null
}

function applyBrandColors(settings) {
  const root = document.documentElement
  const p = hexToRgb(settings.primaryColor) || [0, 184, 230]
  root.style.setProperty('--brand-primary', settings.primaryColor)
  root.style.setProperty('--brand-primary-glow', `rgba(${p[0]},${p[1]},${p[2]},0.22)`)
  root.style.setProperty('--brand-primary-dim',  `rgba(${p[0]},${p[1]},${p[2]},0.09)`)
}

export default function App() {
  const [players, setPlayers] = useState(() => loadPlayers())
  const [page, setPage] = useState('tracker')
  const [settings, setSettings] = useState(() => loadSettings())

  useEffect(() => {
    applyBrandColors(settings)
  }, [settings])

  function handlePlayerAdded(updatedPlayers) {
    setPlayers(updatedPlayers)
  }

  function handleDataImported() {
    setPlayers(loadPlayers())
  }

  function handleSettingsChanged(newSettings) {
    setSettings(newSettings)
  }

  function handleServeAdded() {}

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <div className="header-brand">
            <div className="header-wordmark">
              {settings.teamName
                ? <span className="header-team-name">{settings.teamName.toUpperCase()}</span>
                : <>SERVE<span>TRACK</span></>
              }
            </div>
            <div className="live-badge">LIVE</div>
          </div>
          <nav className="header-nav">
            <button
              className={`nav-btn ${page === 'tracker' ? 'active' : ''}`}
              onClick={() => setPage('tracker')}
            >
              Tracker
            </button>
            <button
              className={`nav-btn ${page === 'about' ? 'active' : ''}`}
              onClick={() => setPage('about')}
            >
              About
            </button>
            <button
              className={`nav-btn ${page === 'admin' ? 'active' : ''}`}
              onClick={() => setPage('admin')}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>
      <main className="app-body">
        {page === 'tracker' ? (
          <>
            <AddPlayer onPlayerAdded={handlePlayerAdded} />
            <ServeEntry
              players={players}
              onServeAdded={handleServeAdded}
              onPlayersChanged={handlePlayerAdded}
            />
          </>
        ) : page === 'admin' ? (
          <Admin
            onSettingsChanged={handleSettingsChanged}
            onImported={handleDataImported}
          />
        ) : (
          <About />
        )}
      </main>
    </div>
  )
}
