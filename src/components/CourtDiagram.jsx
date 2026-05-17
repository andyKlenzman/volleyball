// ABOUTME: Interactive volleyball court diagram showing the 6 standard serve-target zones
// ABOUTME: Zones are arranged in standard volleyball numbering (back row: 1,6,5 / front row: 2,3,4)
import { playerStats } from '../storage.js'

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

function heatColor(pct) {
  // 0% = neutral, 100% = strong orange-red
  const alpha = Math.min(pct / 60, 1)
  return `rgba(255, 120, 30, ${alpha * 0.55})`
}

export default function CourtDiagram({ playerNumber, stats, onZoneClick }) {
  return (
    <div className="court-wrapper">
      <div className="net-label">NET</div>
      <div className="court-grid">
        {ZONE_GRID.map((row, ri) =>
          row.map(({ zone, label }) => {
            const pct = stats ? stats.pct[zone] : 0
            const count = stats ? stats.counts[zone] : 0
            return (
              <button
                key={zone}
                className="zone-cell"
                style={{ backgroundColor: heatColor(pct) }}
                onClick={() => onZoneClick(zone)}
                title={`${label}: ${count} serves (${pct}%)`}
              >
                <span className="zone-number">{zone}</span>
                {stats && stats.total > 0 && (
                  <span className="zone-pct">{pct}%</span>
                )}
              </button>
            )
          })
        )}
      </div>
      <div className="server-label">SERVER</div>
    </div>
  )
}
