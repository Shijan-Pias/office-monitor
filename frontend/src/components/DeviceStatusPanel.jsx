// components/DeviceStatusPanel.jsx

const ROOM_ORDER = ["drawing", "work1", "work2"];
const ROOM_LABELS = {
  drawing: "Drawing Room",
  work1: "Work Room 1",
  work2: "Work Room 2",
};

function DeviceRow({ device }) {
  const isOn = device.status === "on";
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: isOn ? "#F5A623" : "#4B5563" }}
        />
        <span className="text-sm text-text">{device.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-text-dim">{device.watt}W</span>
        <span
          className="font-mono text-xs px-2 py-0.5 rounded"
          style={{
            color: isOn ? "#F5A623" : "#8B949E",
            backgroundColor: isOn ? "rgba(245,166,35,0.12)" : "transparent",
          }}
        >
          {isOn ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
}

function DeviceStatusPanel({ devices }) {
  if (!devices) return null;

  return (
    <div className="rounded-xl border border-panel-border bg-panel p-5">
      <div className="font-display text-sm text-text-dim uppercase tracking-wide mb-3">
        Live Device Status
      </div>

      <div className="flex flex-col gap-4">
        {ROOM_ORDER.map((roomKey) => {
          const roomDevices = devices.filter((d) => d.room === roomKey);
          return (
            <div key={roomKey}>
              <div className="text-xs text-text-dim mb-1 px-3">
                {ROOM_LABELS[roomKey]}
              </div>
              <div className="flex flex-col">
                {roomDevices.map((d) => (
                  <DeviceRow key={d.id} device={d} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DeviceStatusPanel;