// ABOUTME: Displays serve distribution stats for a selected player
// ABOUTME: Shows total sample count and per-zone/error breakdown with percentages
export default function PlayerStats({ player, stats }) {
  if (!player) return null

  const label = player.name ? `#${player.number} ${player.name}` : `#${player.number}`

  const rows = [
    { key: '1', label: 'Zone 1' },
    { key: '2', label: 'Zone 2' },
    { key: '3', label: 'Zone 3' },
    { key: '4', label: 'Zone 4' },
    { key: '5', label: 'Zone 5' },
    { key: '6', label: 'Zone 6' },
    { key: 'net', label: 'Error: Net' },
    { key: 'oob', label: 'Error: OOB' },
  ]

  return (
    <div className="stats-panel">
      <h3>{label}</h3>
      <p className="sample-count">{stats.total} serve{stats.total !== 1 ? 's' : ''} recorded</p>
      {stats.total === 0 ? (
        <p className="muted">No serves yet — click a zone or error to record one.</p>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Target</th>
              <th>Count</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, label }) => (
              <tr key={key} className={stats.counts[key] > 0 ? 'has-data' : ''}>
                <td>{label}</td>
                <td>{stats.counts[key]}</td>
                <td className="pct-cell">{stats.pct[key]}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
