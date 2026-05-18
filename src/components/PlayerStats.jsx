// ABOUTME: Displays serve distribution stats for a selected player
// ABOUTME: Shows total sample count and per-zone/error breakdown with animated bar charts

export default function PlayerStats({ player, stats }) {
  if (!player) return null

  const label = player.name ? `#${player.number} ${player.name}` : `#${player.number}`

  const zoneRows = [
    { key: '1', label: 'Zone 1' },
    { key: '2', label: 'Zone 2' },
    { key: '3', label: 'Zone 3' },
    { key: '4', label: 'Zone 4' },
    { key: '5', label: 'Zone 5' },
    { key: '6', label: 'Zone 6' },
  ]

  const errorRows = [
    { key: 'net', label: 'Net',  color: 'var(--net-color)' },
    { key: 'oob', label: 'OOB',  color: 'var(--oob-color)' },
  ]

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <div className="stats-player-label">{label}</div>
        <div className="stats-total">{stats.total} serve{stats.total !== 1 ? 's' : ''} recorded</div>
      </div>

      {stats.total === 0 ? (
        <div className="empty-stats">
          <p>No serves yet.</p>
          <p>Tap a zone or error button to record.</p>
        </div>
      ) : (
        <div className="stats-rows">
          <div className="stats-category">Zones</div>
          {zoneRows.map(({ key, label }) => (
            <div key={key} className="stat-row">
              <span className="stat-label">{label}</span>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${stats.pct[key]}%`, background: 'var(--accent)' }}
                />
              </div>
              <span className={`stat-pct ${stats.counts[key] > 0 ? 'active' : ''}`}>
                {stats.pct[key]}%
              </span>
            </div>
          ))}

          <div className="stat-divider" />

          <div className="stats-category">Errors</div>
          {errorRows.map(({ key, label, color }) => (
            <div key={key} className="stat-row">
              <span className="stat-label">{label}</span>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${stats.pct[key]}%`, background: color }}
                />
              </div>
              <span className={`stat-pct ${stats.counts[key] > 0 ? 'active' : ''}`}>
                {stats.pct[key]}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
