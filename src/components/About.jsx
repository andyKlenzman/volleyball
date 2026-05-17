// ABOUTME: About page explaining how the serve tracker works
// ABOUTME: Covers data storage (localStorage) and intended use by coaches between matches

export default function About() {
  return (
    <div className="about-page">
      <div className="card">
        <h2>How It Works</h2>
        <div className="about-section">
          <h3>Tracking Serves</h3>
          <p>
            Add players by jersey number and optional name. Select a player, then tap a
            zone on the court diagram to record where their serve landed — or hit
            <strong> Net</strong> or <strong>Out of Bounds</strong> for errors.
          </p>
          <p>
            The court shows standard volleyball zones (1–6). The heat overlay and
            percentages update live as you record serves.
          </p>
        </div>

        <div className="about-section">
          <h3>Data Storage</h3>
          <p>
            All data is saved in this browser's <strong>local storage</strong> on this
            device. Nothing is sent to a server. As long as you use the same browser on
            the same device, your player roster and every serve entry will persist
            between sessions — so coaches can pull up stats before or between matches
            without losing any history.
          </p>
          <p>
            Clearing your browser's site data or cache will erase all records. For
            long-term storage, use the same browser profile and avoid clearing browsing
            data for this site.
          </p>
        </div>

        <div className="about-section">
          <h3>Reading the Stats</h3>
          <p>
            The stats table shows each zone and error type with a raw count and
            percentage of total serves. Higher percentages highlight a player's
            tendencies — useful for opponent scouting or identifying areas to work on
            in practice.
          </p>
        </div>
      </div>
    </div>
  )
}
