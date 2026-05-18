// ABOUTME: Root application component for the volleyball serve tracker
// ABOUTME: Manages the player roster state and renders AddPlayer, DataManager, and ServeEntry panels
import { useState } from 'react'
import AddPlayer from './components/AddPlayer.jsx'
import ServeEntry from './components/ServeEntry.jsx'
import DataManager from './components/DataManager.jsx'
import About from './components/About.jsx'
import { loadPlayers } from './storage.js'

export default function App() {
  const [players, setPlayers] = useState(() => loadPlayers())
  const [page, setPage] = useState('tracker')

  function handlePlayerAdded(updatedPlayers) {
    setPlayers(updatedPlayers)
  }

  function handleDataImported() {
    setPlayers(loadPlayers())
  }

  // Triggered after a serve is recorded; players list doesn't change but
  // ServeEntry manages its own stats refresh internally
  function handleServeAdded() {}

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <div className="header-brand">
            <div className="header-wordmark">SERVE<span>TRACK</span></div>
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
          </nav>
        </div>
      </header>
      <main className="app-body">
        {page === 'tracker' ? (
          <>
            <AddPlayer onPlayerAdded={handlePlayerAdded} />
            <DataManager onImported={handleDataImported} />
            <ServeEntry
              players={players}
              onServeAdded={handleServeAdded}
              onPlayersChanged={handlePlayerAdded}
            />
          </>
        ) : (
          <About />
        )}
      </main>
    </div>
  )
}
