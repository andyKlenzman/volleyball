// ABOUTME: Import/export component for saving and restoring all tracker data as JSON
// ABOUTME: Uses Web Share API on iPad/iOS (native share sheet) with anchor-download fallback

import { useRef, useState } from 'react'
import { exportData, importData } from '../storage.js'

export default function DataManager({ onImported }) {
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState('')   // '' | 'confirm' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [pendingData, setPendingData] = useState(null)

  async function handleExport() {
    const data = exportData()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const date = new Date().toISOString().slice(0, 10)
    const filename = `volleyball-${date}.json`

    // iOS: Web Share API opens the native share sheet (Files, AirDrop, email, etc.)
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: 'application/json' })
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Volleyball Serve Data' })
        } catch (err) {
          // AbortError means user dismissed the sheet — not an error worth showing
        }
        return
      }
    }

    // Desktop fallback: trigger browser download
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
    e.target.value = ''   // reset so the same file can be re-selected if needed
    if (!file) return

    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result)
        if (!Array.isArray(data.players) || !Array.isArray(data.serves)) {
          throw new Error('Missing players or serves — is this the right file?')
        }
        setPendingData(data)
        setStatus('confirm')
        setErrorMsg('')
      } catch (err) {
        setStatus('error')
        setErrorMsg(err.message || 'Could not read file')
        setPendingData(null)
      }
    }
    reader.readAsText(file)
  }

  function confirmImport() {
    try {
      importData(pendingData)
      setStatus('')
      setPendingData(null)
      onImported()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  function cancelImport() {
    setStatus('')
    setPendingData(null)
  }

  return (
    <div className="card data-manager">
      <h2>Data</h2>
      <div className="data-actions">
        <button className="btn-data" onClick={handleExport}>
          ↑ Export
        </button>
        <button className="btn-data" onClick={() => fileInputRef.current?.click()}>
          ↓ Import
        </button>
        <input
          type="file"
          accept=".json,application/json"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {status === 'confirm' && pendingData && (
        <div className="data-confirm">
          <p>
            Load <strong>{pendingData.players.length} player{pendingData.players.length !== 1 ? 's' : ''}</strong> and{' '}
            <strong>{pendingData.serves.length} serve{pendingData.serves.length !== 1 ? 's' : ''}</strong>?
            {' '}This replaces all current data.
          </p>
          <div className="data-confirm-btns">
            <button className="btn-confirm-yes" onClick={confirmImport}>Replace &amp; Load</button>
            <button className="btn-confirm-no" onClick={cancelImport}>Cancel</button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <p className="data-error">{errorMsg}</p>
      )}
    </div>
  )
}
