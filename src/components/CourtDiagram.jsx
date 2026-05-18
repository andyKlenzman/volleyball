// ABOUTME: Interactive volleyball court diagram showing the 6 standard serve-target zones
// ABOUTME: Zones are arranged in standard volleyball numbering (back row: 1,6,5 / front row: 2,3,4)

// Standard volleyball zone layout viewed from server side:
//   Front row (net side): 4 | 3 | 2
//   Back row (baseline):  5 | 6 | 1
const ZONE_GRID = [
  [
    { zone: '4', label: 'Zone 4', row: 'front', col: 'left' },
    { zone: '3', label: 'Zone 3', row: 'front', col: 'mid' },
    { zone: '2', label: 'Zone 2', row: 'front', col: 'right' },
  ],
  [
    { zone: '5', label: 'Zone 5', row: 'back', col: 'left' },
    { zone: '6', label: 'Zone 6', row: 'back', col: 'mid' },
    { zone: '1', label: 'Zone 1', row: 'back', col: 'right' },
  ],
]

// Heatmap: cool blue (low) → amber → hot red (high)
function heatColor(pct) {
  if (pct === 0) return 'transparent'
  const clamp = Math.min(pct, 100)
  const h = Math.round(210 - (clamp / 100) * 210)
  const alpha = 0.12 + (clamp / 100) * 0.6
  return `hsla(${h}, 82%, 56%, ${alpha})`
}

export default function CourtDiagram({ stats, onZoneClick, large = false, readOnly = false }) {
  function renderZone(zone, label) {
    const pct = stats ? stats.pct[zone] : 0
    const count = stats ? stats.counts[zone] : 0
    return (
      <button
        key={zone}
        className="zone-cell"
        style={{ backgroundColor: heatColor(pct) }}
        onClick={readOnly ? undefined : () => onZoneClick(zone)}
        disabled={readOnly}
        title={`${label}: ${count} serves (${pct}%)`}
      >
        <span className="zone-number">{zone}</span>
        {stats && stats.total > 0 && (
          <span className="zone-pct">{pct}%</span>
        )}
      </button>
    )
  }

  return (
    <div className={`court-wrapper${large ? ' court-wrapper--large' : ''}`}>
      <div className="net-label">NET</div>
      <div className="net-bar" />
      <div className="court-grid">
        {ZONE_GRID[0].map(({ zone, label }) => renderZone(zone, label))}
      </div>
      <div className="attack-line" />
      <div className="court-grid">
        {ZONE_GRID[1].map(({ zone, label }) => renderZone(zone, label))}
      </div>
      <div className="server-label">SERVER</div>
    </div>
  )
}
