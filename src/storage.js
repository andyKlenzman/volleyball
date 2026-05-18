// ABOUTME: localStorage persistence layer for players and serve entries
// ABOUTME: All data is stored as JSON under two keys: vb_players and vb_serves

const KEYS = {
  players: 'vb_players',
  serves: 'vb_serves',
}

export function loadPlayers() {
  try {
    const raw = localStorage.getItem(KEYS.players)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePlayers(players) {
  localStorage.setItem(KEYS.players, JSON.stringify(players))
}

export function addPlayer(number, name = '') {
  const players = loadPlayers()
  if (players.find(p => p.number === number)) {
    throw new Error(`Player #${number} already exists`)
  }
  const updated = [...players, { number, name: name.trim() }]
  savePlayers(updated)
  return updated
}

export function loadServes() {
  try {
    const raw = localStorage.getItem(KEYS.serves)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveServes(serves) {
  localStorage.setItem(KEYS.serves, JSON.stringify(serves))
}

export function removePlayer(number) {
  const players = loadPlayers().filter(p => p.number !== number)
  savePlayers(players)
  // Also remove all serves for this player
  const serves = loadServes().filter(s => s.playerNumber !== number)
  saveServes(serves)
  return players
}

export function updatePlayerName(number, name) {
  const players = loadPlayers().map(p =>
    p.number === number ? { ...p, name: name.trim() } : p
  )
  savePlayers(players)
  return players
}

export function undoLastServe(playerNumber) {
  const serves = loadServes()
  const lastIdx = serves.map(s => s.playerNumber).lastIndexOf(playerNumber)
  if (lastIdx === -1) return serves
  const updated = [...serves.slice(0, lastIdx), ...serves.slice(lastIdx + 1)]
  saveServes(updated)
  return updated
}

export function addServe(playerNumber, result) {
  const serves = loadServes()
  const updated = [...serves, { playerNumber, result, timestamp: Date.now() }]
  saveServes(updated)
  return updated
}

// Returns a snapshot of all data suitable for JSON export
export function exportData() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    players: loadPlayers(),
    serves: loadServes(),
  }
}

// Validates and replaces all data from an imported snapshot
export function importData(data) {
  if (!data || !Array.isArray(data.players) || !Array.isArray(data.serves)) {
    throw new Error('File is missing players or serves data')
  }
  savePlayers(data.players)
  saveServes(data.serves)
}

// Returns stats for a single player: counts and percentages per result
export function playerStats(playerNumber) {
  const serves = loadServes().filter(s => s.playerNumber === playerNumber)
  const total = serves.length

  const results = ['1', '2', '3', '4', '5', '6', 'net', 'oob']
  const counts = Object.fromEntries(results.map(r => [r, 0]))

  for (const s of serves) {
    if (counts[s.result] !== undefined) counts[s.result]++
  }

  const pct = Object.fromEntries(
    results.map(r => [r, total > 0 ? Math.round((counts[r] / total) * 100) : 0])
  )

  return { total, counts, pct }
}
