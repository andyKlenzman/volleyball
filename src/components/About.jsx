// ABOUTME: About page explaining how the serve tracker works
// ABOUTME: Covers tracking, board mode, and data storage/import/export

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
            The court shows standard volleyball zones (1–6). The heat overlay updates
            live as you record serves, so the hottest zones get darker.
          </p>
        </div>

        <div className="about-section">
          <h3>Show Team</h3>
          <p>
            Once a player has serves recorded, tap <strong>Show Team ▸</strong> to
            open the full-screen board view. The court fills the screen with large zone
            numbers and heat overlay, plus three key metrics: hot zone, in-play rate,
            and error rate. Designed to be readable from across a huddle circle.
          </p>
          <p>
            Tap <strong>✕ Exit Board</strong> to return to data entry.
          </p>
        </div>

        <div className="about-section">
          <h3>Data &amp; Settings</h3>
          <p>
            All data is saved in this browser's <strong>local storage</strong> on this
            device — nothing is sent to a server. Your roster and every serve entry
            persist between sessions as long as you use the same browser profile.
          </p>
          <p>
            Open <strong>Admin</strong> to export a backup after each session or import
            a previously saved file. On iPad, export opens the native share sheet so
            you can save to Files, AirDrop it, or email it.
          </p>
          <p>
            Admin also lets you set your <strong>team name</strong> (shown in the header)
            and pick a <strong>team color</strong> for highlights and active states.
          </p>
        </div>

      </div>
    </div>
  )
}
