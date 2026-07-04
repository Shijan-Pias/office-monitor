
// App.jsx
import { useSocket } from "./hooks/useSocket";
import OfficeLayout from "./components/OfficeLayout";
import PowerMeter from "./components/PowerMeter";
import DeviceStatusPanel from "./components/DeviceStatusPanel";
import AlertsPanel from "./components/AlertsPanel";

function App() {
  const { snapshot, connected } = useSocket();

  return (
    <div className="min-h-screen bg-bg font-body px-6 py-8 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">
            Office Monitor
          </h1>
          <p className="text-sm text-text-dim">
            Live device &amp; power tracking — Drawing Room, Work Room 1, Work Room 2
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: connected ? "#10B981" : "#EF4444" }}
          />
          <span className="text-xs text-text-dim font-mono">
            {connected ? "LIVE" : "DISCONNECTED"}
          </span>
        </div>
      </header>

      {!snapshot ? (
        <div className="text-text-dim text-sm">Connecting to backend...</div>
      ) : (
        <>
          {/* Signature element: top-view office layout */}
          <OfficeLayout devices={snapshot.devices} />

          {/* Main grid: power meter + alerts + device list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PowerMeter
              totalWatt={snapshot.totalWatt}
              wattByRoom={snapshot.wattByRoom}
              estimatedKwhToday={snapshot.estimatedKwhToday}
            />
            <AlertsPanel alerts={snapshot.alerts} />
            <DeviceStatusPanel devices={snapshot.devices} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;





