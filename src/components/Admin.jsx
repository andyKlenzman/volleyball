// ABOUTME: Admin panel for team name, brand color customization, and data import/export
// ABOUTME: Color changes apply as a live preview; Save persists them to localStorage

import { useRef, useState } from 'react'
import { loadSettings, saveSettings, exportData, importData } from '../storage.js'

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null
}

function luminanceFromHex(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const [r, g, b] = rgb.map(v => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Contrast ratio against the dark surface background (#0c1427, luminance ~0.009)
const SURFACE_L = 0.009
function contrastOnDark(hex) {
  return (luminanceFromHex(hex) + 0.05) / (SURFACE_L + 0.05)
}

function applyPreviewColors(primary, secondary) {
  const root = document.documentElement
  const p = hexToRgb(primary) || [0, 184, 230]
  const s = hexToRgb(secondary) || [255, 100, 32]
  root.style.setProperty('--brand-primary', primary)
  root.style.setProperty('--brand-primary-glow', `rgba(${p[0]},${p[1]},${p[2]},0.22)`)
  root.style.setProperty('--brand-primary-dim',  `rgba(${p[0]},${p[1]},${p[2]},0.09)`)
  root.style.setProperty('--brand-secondary',     secondary)
  root.style.setProperty('--brand-secondary-glow', `rgba(${s[0]},${s[1]},${s[2]},0.22)`)
}

export default function Admin({ onSettingsChanged, onImported }) {
  const initial = loadSettings()
  const [teamName, setTeamName] = useState(initial.teamName)
  const [primaryColor, setPrimaryColor] = useState(initial.primaryColor)
  const [secondaryColor, setSecondaryColor] = useState(initial.secondaryColor)
  const [saved, setSaved] = useState(false)

  const fileInputRef = useRef(null)
  const [importStatus, setImportStatus] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [pendingData, setPendingData] = useState(null)

  function handlePrimaryChange(e) {
    setPrimaryColor(e.target.value)
    applyPreviewColors(e.target.value, secondaryColor)
  }

  function handleSecondaryChange(e) {
    setSecondaryColor(e.target.value)
    applyPreviewColors(primaryColor, e.target.value)
  }

  function handleSave() {
    const settings = { teamName: teamName.trim(), primaryColor, secondaryColor }
    saveSettings(settings)
    onSettingsChanged(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleExport() {
    const data = exportData()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const date = new Date().toISOString().slice(0, 10)
    const slug = teamName.trim()
      ? teamName.trim().toLowerCase().replace(/\s+/g, '-')
      : 'volleyball'
    const filename = `${slug}-${date}.json`

    if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: 'application/json' })
      if (navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: 'Volleyball Serve Data' }) } catch { }
        return
      }
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result)
        if (!Array.isArray(data.players) || !Array.isArray(data.serves)) {
          throw new Error('Missing players or serves — is this the right file?')
        }
        setPendingData(data)
        setImportStatus('confirm')
        setErrorMsg('')
      } catch (err) {
        setImportStatus('error')
        setErrorMsg(err.message || 'Could not read file')
        setPendingData(null)
      }
    }
    reader.readAsText(file)
  }

  function confirmImport() {
    try {
      importData(pendingData)
      setImportStatus('')
      setPendingData(null)
      onImported()
    } catch (err) {
      setImportStatus('error')
      setErrorMsg(err.message)
    }
  }

  const primaryContrast = contrastOnDark(primaryColor)
  const secondaryContrast = contrastOnDark(secondaryColor)

  return (
    <div className="admin-page">
      <div className="card">
        <h2>Team Settings</h2>

        <div className="admin-section">
          <div className="admin-field">
            <label className="admin-label">Team Name</label>
            <input
              type="text"
              placeholder="e.g. Valley Hawks"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              className="input-long"
              maxLength={40}
            />
            <p className="admin-hint">Replaces SERVETRACK in the header when set</p>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-field">
            <label className="admin-label">Primary Color</label>
            <div className="color-row">
              <input
                type="color"
                value={primaryColor}
                onChange={handlePrimaryChange}
                className="color-input"
              />
              <span className="color-swatch" style={{ background: primaryColor }} />
              <span className="color-hex">{primaryColor.toUpperCase()}</span>
              {primaryContrast < 4.5 && (
                <span className="color-warn">
                  {primaryContrast < 2.0
                    ? '⚠ Too dark — nearly invisible on dark backgrounds'
                    : '⚠ Low contrast on dark background'}
                </span>
              )}
            </div>
            <p className="admin-hint">Active states, borders, zone highlights, nav indicator</p>
          </div>

          <div className="admin-field">
            <label className="admin-label">Secondary Color</label>
            <div className="color-row">
              <input
                type="color"
                value={secondaryColor}
                onChange={handleSecondaryChange}
                className="color-input"
              />
              <span className="color-swatch" style={{ background: secondaryColor }} />
              <span className="color-hex">{secondaryColor.toUpperCase()}</span>
              {secondaryContrast < 4.5 && (
                <span className="color-warn">
                  {secondaryContrast < 2.0
                    ? '⚠ Too dark — nearly invisible on dark backgrounds'
                    : '⚠ Low contrast on dark background'}
                </span>
              )}
            </div>
            <p className="admin-hint">Action buttons, hot zone badge, primary CTAs</p>
          </div>

          <p className="admin-color-note">
            Colors are used as accents only — text always stays on a dark neutral surface,
            so readable text is guaranteed regardless of which colors you choose. Warnings
            only appear when a color would be hard to see as a border or glow.
          </p>
        </div>

        <button className="btn-save-settings" onClick={handleSave}>
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>

      <div className="card">
        <h2>Data</h2>
        <p className="admin-hint" style={{ marginBottom: '0.85rem' }}>
          Export a backup after each session. Import to restore a previous session's data.
          On iPad, export opens the native share sheet.
        </p>
        <div className="data-actions">
          <button className="btn-data" onClick={handleExport}>↑ Export</button>
          <button className="btn-data" onClick={() => fileInputRef.current?.click()}>↓ Import</button>
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {importStatus === 'confirm' && pendingData && (
          <div className="data-confirm">
            <p>
              Load <strong>{pendingData.players.length} player{pendingData.players.length !== 1 ? 's' : ''}</strong>{' '}
              and <strong>{pendingData.serves.length} serve{pendingData.serves.length !== 1 ? 's' : ''}</strong>?
              {' '}This replaces all current data.
            </p>
            <div className="data-confirm-btns">
              <button className="btn-confirm-yes" onClick={confirmImport}>Replace &amp; Load</button>
              <button className="btn-confirm-no" onClick={() => { setImportStatus(''); setPendingData(null) }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {importStatus === 'error' && (
          <p className="data-error">{errorMsg}</p>
        )}
      </div>
    </div>
  )
}
