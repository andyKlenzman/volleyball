// ABOUTME: Form component for registering a new player by jersey number and optional name
// ABOUTME: Validates that the number is unique before adding to the roster
import { useState } from 'react'
import { addPlayer } from '../storage.js'

export default function AddPlayer({ onPlayerAdded }) {
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const num = parseInt(number, 10)
    if (!number || isNaN(num) || num < 0) {
      setError('Enter a valid jersey number')
      return
    }

    try {
      const updated = addPlayer(num, name)
      onPlayerAdded(updated)
      setNumber('')
      setName('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card">
      <h2>Add Player</h2>
      <form onSubmit={handleSubmit} className="add-player-form">
        <div className="field-row">
          <label htmlFor="jersey">#</label>
          <input
            id="jersey"
            type="number"
            min="0"
            max="99"
            placeholder="Jersey #"
            value={number}
            onChange={e => setNumber(e.target.value)}
            className="input-short"
          />
          <label htmlFor="pname">Name</label>
          <input
            id="pname"
            type="text"
            placeholder="Optional name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="input-long"
          />
          <button type="submit" className="btn-primary">Add</button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
