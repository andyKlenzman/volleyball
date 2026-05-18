// ABOUTME: Main serve-entry panel combining player selection, court diagram, and stats
// ABOUTME: Selecting a player immediately shows their stats; clicking zones/errors records a serve
import { useState, useEffect } from 'react'
import CourtDiagram from './CourtDiagram.jsx'
import PresentationView from './PresentationView.jsx'
import { addServe, playerStats, removePlayer, updatePlayerName, undoLastServe } from '../storage.js'

export default function ServeEntry({ players, onServeAdded, onPlayersChanged }) {
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [stats, setStats] = useState(null)
  const [flash, setFlash] = useState('')
  const [editingNumber, setEditingNumber] = useState(null)
  const [editName, setEditName] = useState('')
  const [presentMode, setPresentMode] = useState(false)

  function refreshStats(number) {
    setStats(playerStats(number))
  }

  useEffect(() => {
    if (selectedNumber !== null) refreshStats(selectedNumber)
  }, [selectedNumber])

  // Clear stale selection when the players list changes (e.g. after data import)
  useEffect(() => {
    if (selectedNumber !== null && !players.find(p => p.number === selectedNumber)) {
      setSelectedNumber(null)
      setStats(null)
      setPresentMode(false)
    }
  }, [players, selectedNumber])

  function handlePlayerSelect(number) {
    if (editingNumber !== null) return
    setSelectedNumber(number)
    setFlash('')
    setPresentMode(false)
  }

  function handleDeletePlayer(e, number) {
    e.stopPropagation()
    const updated = removePlayer(number)
    if (selectedNumber === number) {
      setSelectedNumber(null)
      setStats(null)
      setPresentMode(false)
    }
    onPlayersChanged(updated)
  }

  function handleEditStart(e, p) {
    e.stopPropagation()
    setEditingNumber(p.number)
    setEditName(p.name)
  }

  function handleEditSave(number) {
    const updated = updatePlayerName(number, editName)
    setEditingNumber(null)
    onPlayersChanged(updated)
    if (selectedNumber === number) refreshStats(number)
  }

  function handleEditKeyDown(e, number) {
    if (e.key === 'Enter') handleEditSave(number)
    if (e.key === 'Escape') setEditingNumber(null)
  }

  function recordServe(result) {
    if (selectedNumber === null) return
    addServe(selectedNumber, result)
    refreshStats(selectedNumber)
    onServeAdded()
    const labels = {
      net: 'Net!', oob: 'Out of Bounds!',
      '1': 'Zone 1', '2': 'Zone 2', '3': 'Zone 3',
      '4': 'Zone 4', '5': 'Zone 5', '6': 'Zone 6',
    }
    setFlash(labels[result] || result)
    setTimeout(() => setFlash(''), 1200)
  }

  function handleUndo() {
    if (selectedNumber === null) return
    undoLastServe(selectedNumber)
    refreshStats(selectedNumber)
    setFlash('Undone')
    setTimeout(() => setFlash(''), 1200)
  }

  const selectedPlayer = players.find(p => p.number === selectedNumber) || null

  return (
    <>
      {presentMode && selectedPlayer && stats && (
        <PresentationView
          player={selectedPlayer}
          stats={stats}
          onExit={() => setPresentMode(false)}
        />
      )}

      <div className="serve-entry">
        <div className="card player-select-section">
          <h2>Select Player</h2>
          <div className="player-chips">
            {players.length === 0 && <p className="muted">Add players above first.</p>}
            {players.map(p => (
              <div
                key={p.number}
                className={`player-chip ${selectedNumber === p.number ? 'active' : ''}`}
                onClick={() => handlePlayerSelect(p.number)}
              >
                <span className="chip-number">#{p.number}</span>
                {editingNumber === p.number ? (
                  <input
                    className="chip-edit-input"
                    value={editName}
                    autoFocus
                    onChange={e => setEditName(e.target.value)}
                    onBlur={() => handleEditSave(p.number)}
                    onKeyDown={e => handleEditKeyDown(e, p.number)}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="chip-name chip-name-editable"
                    onClick={e => handleEditStart(e, p)}
                    title="Tap to edit name"
                  >
                    {p.name || 'add name'}
                  </span>
                )}
                <button
                  className="chip-delete"
                  onClick={e => handleDeletePlayer(e, p.number)}
                  title="Remove player"
                >×</button>
              </div>
            ))}
          </div>
        </div>

        {selectedPlayer && (
          <div className="card">
            <div className="court-header">
              <div className="player-display">
                <span className="player-jersey">#{selectedPlayer.number}</span>
                {selectedPlayer.name && <span className="player-name-label">{selectedPlayer.name}</span>}
              </div>
              {stats && stats.total > 0 && (
                <button className="btn-undo" onClick={handleUndo}>↩ Undo</button>
              )}
            </div>
            <CourtDiagram
              stats={stats}
              onZoneClick={recordServe}
            />
            <div className="error-buttons">
              <button className="btn-error net" onClick={() => recordServe('net')}>
                Net
              </button>
              <button className="btn-error oob" onClick={() => recordServe('oob')}>
                Out of Bounds
              </button>
            </div>
            {flash && <div className="flash">{flash}</div>}
            {stats && stats.total > 0 && (
              <button className="btn-board" onClick={() => setPresentMode(true)}>
                Show Team ▸
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
