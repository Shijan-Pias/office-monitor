// routes/api.js
// ----------------------------------------------------------------
// REST API endpoints। এগুলো মূলত dashboard-এর প্রথমবার load হওয়ার
// সময় কাজে লাগবে (socket.io কানেক্ট হওয়ার আগেই কিছু data লাগবে),
// আর Postman/curl দিয়ে backend আলাদাভাবে টেস্ট করতেও কাজে লাগবে।
//
// Discord bot যেহেতু একই Node.js process-এর ভেতরে চলবে, ও চাইলে
// deviceStore.js থেকে সরাসরি function import করে নিতে পারে —
// নিজের backend-কে HTTP call করার দরকার নেই। কিন্তু data-র "shape"
// (যেমন buildSnapshot এর output) সবজায়গায় একইরকম রাখছি, যাতে
// dashboard আর bot সবসময় same reality দেখে।
// ----------------------------------------------------------------

import { Router } from "express";
import {
  getAllDevices,
  getDevicesByRoom,
  getRoomList,
  ROOM_CONFIG,
  getCurrentTotalWatt,
  getWattByRoom,
  getEstimatedKwhToday,
} from "../data/deviceStore.js";
import { getActiveAlerts } from "../alerts/alertEngine.js";

const router = Router();

// GET /api/alerts -> বর্তমানে active সব alert (after-hours / continuous-on)
router.get("/alerts", (req, res) => {
  res.json(getActiveAlerts());
});

// GET /api/status  -> পুরো অফিসের সব ডিভাইসের অবস্থা
router.get("/status", (req, res) => {
  res.json({
    devices: getAllDevices(),
    totalWatt: getCurrentTotalWatt(),
    wattByRoom: getWattByRoom(),
    timestamp: new Date().toISOString(),
  });
});

// GET /api/rooms -> রুমের তালিকা (frontend-কে room name গুলো জানাতে সুবিধা হবে)
router.get("/rooms", (req, res) => {
  res.json(getRoomList());
});

// GET /api/room/:roomKey -> নির্দিষ্ট একটা রুমের অবস্থা
router.get("/room/:roomKey", (req, res) => {
  const { roomKey } = req.params;

  if (!ROOM_CONFIG[roomKey]) {
    // ভুল room নাম দিলে 404, সাথে valid room গুলোর হিন্ট
    return res.status(404).json({
      error: `Room "${roomKey}" not found`,
      validRooms: Object.keys(ROOM_CONFIG),
    });
  }

  const devices = getDevicesByRoom(roomKey);
  const totalWatt = devices
    .filter((d) => d.status === "on")
    .reduce((sum, d) => sum + d.watt, 0);

  res.json({
    room: roomKey,
    label: ROOM_CONFIG[roomKey].label,
    devices,
    totalWatt,
  });
});

// GET /api/usage -> live power + আজকের আনুমানিক kWh
router.get("/usage", (req, res) => {
  res.json({
    totalWatt: getCurrentTotalWatt(),
    wattByRoom: getWattByRoom(),
    estimatedKwhToday: Number(getEstimatedKwhToday().toFixed(2)),
  });
});

export default router;