// ABOUTME: Full-screen team huddle view — large court heatmap with key metrics
// ABOUTME: Triggered by coach, readable from several feet away; no data entry in this mode

import CourtDiagram from './CourtDiagram.jsx'

function getHotZone(stats) {
  if (!stats || stats.total === 0) return null
  let best = null, bestCount = 0
  for (const z of ['1', '2', '3', '4', '5', '6']) {
    if ((stats.counts[z] || 0) > bestCount) {
      bestCount = stats.counts[z]
      best = z
    }
  }
  return best ? { zone: best, pct: stats.pct[best] } : null
}

export default function PresentationView({ player, stats, onExit }) {
  if (!player || !stats) return null

  const label = player.name ? `#${player.number}  ${player.name}` : `#${player.number}`
  const errorCount = (stats.counts['net'] || 0) + (stats.counts['oob'] || 0)
  const errorPct = stats.total > 0 ? Math.round((errorCount / stats.total) * 100) : 0
  const inPlayPct = 100 - errorPct
  const hotZone = getHotZone(stats)
  const lowSample = stats.total > 0 && stats.total < 6

  return (
    <div className="present-overlay">
      <div className="present-topbar">
        <div className="present-player-label">{label}</div>
        <div className="present-topbar-right">
          {lowSample && (
            <div className="present-warning">LOW SAMPLE ({stats.total})</div>
          )}
          <div className="present-serve-count">{stats.total} serves</div>
          <button className="btn-exit-board" onClick={onExit}>✕ EXIT BOARD</button>
        </div>
      </div>

      <div className="present-court-wrap">
        <CourtDiagram stats={stats} large readOnly />
      </div>

      <div className="present-metrics">
        {hotZone ? (
          <div className="metric-card metric-hot">
            <div className="metric-label">HOT ZONE</div>
            <div className="metric-value metric-val-hot">{hotZone.zone}</div>
            <div className="metric-sub">{hotZone.pct}% of serves</div>
          </div>
        ) : (
          <div className="metric-card">
            <div className="metric-label">HOT ZONE</div>
            <div className="metric-value metric-val-dim">—</div>
            <div className="metric-sub">no data</div>
          </div>
        )}

        <div className="metric-card metric-inplay">
          <div className="metric-label">IN PLAY</div>
          <div className="metric-value metric-val-ok">{stats.total > 0 ? `${inPlayPct}%` : '—'}</div>
          <div className="metric-sub">{stats.total - errorCount} of {stats.total} serves</div>
        </div>

        <div className="metric-card metric-error">
          <div className="metric-label">ERROR RATE</div>
          <div className="metric-value metric-val-err">{stats.total > 0 ? `${errorPct}%` : '—'}</div>
          <div className="metric-sub">{errorCount} errors ({stats.counts['net'] || 0} net · {stats.counts['oob'] || 0} oob)</div>
        </div>
      </div>
    </div>
  )
}
