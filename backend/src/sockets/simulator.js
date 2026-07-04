// simulator.js
// ----------------------------------------------------------------
// এই ফাইলটা একটা "engine" — নিয়মিত সময় পরপর device state পরিবর্তন
// করে এবং সাথে সাথে Socket.io দিয়ে সব connected client-কে জানিয়ে দেয়।
//
// কেন আলাদা ফাইলে? কারণ simulator-এর কাজ হলো শুধু "state বদলানো
// আর জানানো" — এটাকে server.js থেকে আলাদা রাখলে কোড পরিষ্কার থাকে
// (single responsibility)।
// ----------------------------------------------------------------

import {
  randomlyToggleDevices,
  accumulateEnergy,
  getAllDevices,
  getCurrentTotalWatt,
  getWattByRoom,
  getEstimatedKwhToday,
} from "../data/deviceStore.js";
import { getActiveAlerts } from "../alerts/alertEngine.js";

// প্রতি tick-এ dashboard-কে পাঠানোর জন্য একটা snapshot বানানো।
// এটাকে আলাদা ফাংশনে রাখলাম কারণ REST API আর Discord bot-ও
// একই shape-এর data চাইবে — DRY (Don't Repeat Yourself) principle।
function buildSnapshot() {
  return {
    devices: getAllDevices(),
    totalWatt: getCurrentTotalWatt(),
    wattByRoom: getWattByRoom(),
    estimatedKwhToday: Number(getEstimatedKwhToday().toFixed(2)),
    alerts: getActiveAlerts(),
    timestamp: new Date().toISOString(),
  };
}

// simulator শুরু করার ফাংশন। io (socket.io server instance) বাইরে
// থেকে পাস করা হবে, যাতে এই ফাইল socket.io সম্পর্কে বেশি কিছু
// জানার দরকার না পড়ে (loose coupling)।
function startSimulator(io, options = {}) {
  const tickIntervalMs = options.tickIntervalMs || 1000; // energy accumulate + broadcast
  const toggleIntervalMs = options.toggleIntervalMs || 5000; // কত ঘনঘন device toggle হবে

  // ১. প্রতি সেকেন্ডে energy accumulate করা (kWh হিসাবের জন্য accuracy দরকার)
  //    এবং dashboard-কে latest snapshot broadcast করা।
  setInterval(() => {
    accumulateEnergy();
    io.emit("state:update", buildSnapshot());
  }, tickIntervalMs);

  // ২. প্রতি কয়েক সেকেন্ডে random device toggle করা, যাতে data
  //    সত্যিকারের অফিসের মতো "dynamic" মনে হয়।
  setInterval(() => {
    const changed = randomlyToggleDevices(2); // একসাথে ২টা device পরিবর্তন
    console.log(
      `[simulator] toggled: ${changed.map((d) => `${d.id}->${d.status}`).join(", ")}`
    );
  }, toggleIntervalMs);

  console.log("[simulator] started");
}

export { startSimulator, buildSnapshot };