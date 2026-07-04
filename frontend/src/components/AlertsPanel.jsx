// components/AlertsPanel.jsx

const ROOM_LABELS = {
  drawing: "Drawing Room",
  work1: "Work Room 1",
  work2: "Work Room 2",
};

function AlertsPanel({ alerts }) {
  const list = alerts || [];

  return (
    <div className="rounded-xl border border-panel-border bg-panel p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-sm text-text-dim uppercase tracking-wide">
          Active Alerts
        </span>
        {list.length > 0 && (
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-alert/15 text-alert">
            {list.length}
          </span>
        )}
      </div>

      {list.length === 0 ? (
        <div className="text-sm text-text-dim py-4 text-center">
          No active alerts. Everything looks normal.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {list.map((alert, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 rounded-lg border-l-2 border-alert bg-alert/5 px-3 py-2"
            >
              <div className="text-sm text-text">{alert.message}</div>
              <div className="flex justify-between text-xs text-text-dim">
                <span>{ROOM_LABELS[alert.room] || alert.room}</span>
                <span className="font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertsPanel;