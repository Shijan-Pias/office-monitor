// components/OfficeLayout.jsx
import { motion } from "framer-motion";

const ROOM_ORDER = ["drawing", "work1", "work2"];
const ROOM_LABELS = {
  drawing: "Drawing Room",
  work1: "Work Room 1",
  work2: "Work Room 2",
};

// একটা single fan icon — ON থাকলে ঘুরবে (framer-motion দিয়ে)
function Fan({ isOn }) {
  return (
    <motion.div
      animate={isOn ? { rotate: 360 } : { rotate: 0 }}
      transition={
        isOn
          ? { repeat: Infinity, duration: 1.2, ease: "linear" }
          : { duration: 0.3 }
      }
      className="w-8 h-8 flex items-center justify-center"
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <circle cx="12" cy="12" r="1.5" fill={isOn ? "#F5A623" : "#4B5563"} />
        {[0, 120, 240].map((angle) => (
          <ellipse
            key={angle}
            cx="12"
            cy="7"
            rx="2.2"
            ry="4.5"
            fill={isOn ? "#F5A623" : "#4B5563"}
            opacity={isOn ? 0.9 : 0.5}
            transform={`rotate(${angle} 12 12)`}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// একটা single light bulb — ON থাকলে glow করবে
function Light({ isOn }) {
  return (
    <div
      className="w-5 h-5 rounded-full transition-all duration-500"
      style={{
        backgroundColor: isOn ? "#FFD580" : "#3a3f47",
        boxShadow: isOn
          ? "0 0 16px 6px rgba(245,166,35,0.55), 0 0 4px 1px rgba(255,216,128,0.9)"
          : "none",
      }}
    />
  );
}

function RoomCard({ roomKey, devices }) {
  const fans = devices.filter((d) => d.type === "fan");
  const lights = devices.filter((d) => d.type === "light");
  const anyOn = devices.some((d) => d.status === "on");

  return (
    <div
      className="flex-1 rounded-xl border p-4 flex flex-col gap-4 transition-colors duration-500"
      style={{
        borderColor: anyOn ? "rgba(245,166,35,0.4)" : "var(--color-panel-border)",
        backgroundColor: anyOn ? "rgba(245,166,35,0.04)" : "var(--color-panel)",
      }}
    >
      <div className="font-display text-sm text-text-dim tracking-wide uppercase">
        {ROOM_LABELS[roomKey]}
      </div>

      <div className="flex gap-3 justify-center">
        {fans.map((f) => (
          <Fan key={f.id} isOn={f.status === "on"} />
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        {lights.map((l) => (
          <Light key={l.id} isOn={l.status === "on"} />
        ))}
      </div>
    </div>
  );
}

function OfficeLayout({ devices }) {
  if (!devices) return null;

  return (
    <div className="flex gap-4">
      {ROOM_ORDER.map((roomKey) => (
        <RoomCard
          key={roomKey}
          roomKey={roomKey}
          devices={devices.filter((d) => d.room === roomKey)}
        />
      ))}
    </div>
  );
}

export default OfficeLayout;