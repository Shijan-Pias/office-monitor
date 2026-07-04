// components/PowerMeter.jsx

const ROOM_LABELS = {
  drawing: "Drawing Room",
  work1: "Work Room 1",
  work2: "Work Room 2",
};

function PowerMeter({ totalWatt, wattByRoom, estimatedKwhToday }) {
  // সঠিক max: 6 fans * 60W + 9 lights * 15W = 495W (সব ডিভাইস একসাথে ON)
  const MAX_WATT = 495;
  const percent = Math.min(100, Math.round((totalWatt / MAX_WATT) * 100));

  return (
    <div className="rounded-xl border border-panel-border bg-panel p-5 flex flex-col gap-4">
      <div className="font-display text-sm text-text-dim uppercase tracking-wide">
        Live Power Consumption
      </div>

      <div className="flex items-end gap-2">
        <span className="font-mono text-4xl font-semibold text-on">
          {totalWatt}
        </span>
        <span className="font-mono text-lg text-text-dim mb-1">W</span>
      </div>

      {/* Gauge bar */}
      <div className="w-full h-2 rounded-full bg-off/30 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percent}%`,
            backgroundColor: percent > 75 ? "#EF4444" : "#F5A623",
          }}
        />
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {Object.entries(wattByRoom || {}).map(([room, watt]) => (
          <div key={room} className="flex justify-between text-sm">
            <span className="text-text-dim">{ROOM_LABELS[room]}</span>
            <span className="font-mono text-text">{watt}W</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-panel-border flex justify-between items-center">
        <span className="text-sm text-text-dim">Estimated today</span>
        <span className="font-mono text-lg text-ok">{estimatedKwhToday} kWh</span>
      </div>
    </div>
  );
}

export default PowerMeter;