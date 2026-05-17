# Storage — Technical Reference

All persistence is handled by `src/storage.js`. There is no backend. Data lives in the
browser's `localStorage` under two keys.

---

## Keys

| Key | Contents |
|---|---|
| `vb_players` | JSON array of player objects |
| `vb_serves` | JSON array of serve entry objects |

---

## Schemas

### Player

```json
{
  "number": 7,
  "name": "Jordan"
}
```

| Field | Type | Notes |
|---|---|---|
| `number` | `number` | Jersey number. Primary key — must be unique. |
| `name` | `string` | Optional. Empty string if not set. |

### Serve entry

```json
{
  "playerNumber": 7,
  "result": "3",
  "timestamp": 1716000000000
}
```

| Field | Type | Notes |
|---|---|---|
| `playerNumber` | `number` | Foreign key → `player.number` |
| `result` | `string` | One of `"1"`–`"6"` (zone) or `"net"` / `"oob"` |
| `timestamp` | `number` | `Date.now()` at time of recording (ms since epoch) |

---

## API

All functions are synchronous. Reads parse JSON; writes stringify and call
`localStorage.setItem`.

```
loadPlayers()                       → Player[]
savePlayers(players)                → void
addPlayer(number, name?)            → Player[]   throws if number already exists
removePlayer(number)                → Player[]   also purges all serves for that player
updatePlayerName(number, name)      → Player[]

loadServes()                        → ServeEntry[]
saveServes(serves)                  → void
addServe(playerNumber, result)      → ServeEntry[]
undoLastServe(playerNumber)         → ServeEntry[]   removes most recent entry for that player

playerStats(playerNumber)           → { total, counts, pct }
```

### `playerStats` return shape

```json
{
  "total": 12,
  "counts": { "1": 2, "2": 0, "3": 4, "4": 1, "5": 3, "6": 1, "net": 1, "oob": 0 },
  "pct":    { "1": 17, "2": 0, "3": 33, "4": 8, "5": 25, "6": 8, "net": 8, "oob": 0 }
}
```

Percentages are `Math.round((count / total) * 100)`. All eight result keys are always
present (zero-filled) so callers can read any key without a null check.

---

## Persistence characteristics

- Data survives page reloads, tab closes, and browser restarts.
- Data is **device + browser profile scoped** — it does not sync across devices or
  browsers. A coach must use the same browser on the same device to see the same data.
- Clearing site data, clearing browsing history (with "cookies and site data" checked),
  or using Private/Incognito mode will lose all data.
- There is no migration layer. If the schema changes, old data in localStorage may
  produce unexpected results and should be cleared manually via DevTools →
  Application → Local Storage.

---

## Storage limits

`localStorage` is capped at ~5 MB per origin in most browsers. Each serve entry is
roughly 60 bytes serialised. At 60 bytes/entry, 5 MB holds ~85 000 entries — far beyond
any realistic season's worth of tracking.

---

## Clearing data (manual)

Open browser DevTools → **Application** (Chrome) or **Storage** (Firefox) →
**Local Storage** → select the site origin → delete `vb_players` and/or `vb_serves`.
