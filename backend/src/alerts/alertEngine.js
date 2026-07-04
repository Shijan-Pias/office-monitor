// alerts/alertEngine.js
import { getAllDevices, getDevicesByRoom, ROOM_CONFIG } from "../data/deviceStore.js";

const OFFICE_START_HOUR = 9;
const OFFICE_END_HOUR = 17; // 5 PM
const CONTINUOUS_ON_MS = 2 * 60 * 60 * 1000; // 2 hours

function isWithinOfficeHours(date = new Date()) {
  const hour = date.getHours();
  return hour >= OFFICE_START_HOUR && hour < OFFICE_END_HOUR;
}

// প্রতিবার call হলে fresh recompute করে বর্তমান active alert-এর লিস্ট রিটার্ন করে
function getActiveAlerts() {
  const alerts = [];
  const now = new Date();

  // ১. After-hours alert: office hour-এর বাইরে কোনো device ON থাকলে
  if (!isWithinOfficeHours(now)) {
    for (const device of getAllDevices()) {
      if (device.status === "on") {
        alerts.push({
          type: "after-hours",
          room: device.room,
          deviceId: device.id,
          message: `${device.label} in ${ROOM_CONFIG[device.room].label} is ON outside office hours`,
          timestamp: now.toISOString(),
        });
      }
    }
  }

  // ২. Continuous-on alert: কোনো রুমের সব device ২ ঘন্টার বেশি ON থাকলে
  for (const roomKey of Object.keys(ROOM_CONFIG)) {
    const devices = getDevicesByRoom(roomKey);
    const allOn = devices.every((d) => d.status === "on");
    if (!allOn) continue;

    // সবচেয়ে দেরিতে ON হওয়া device-এর সময় ধরে নিলাম "পুরো রুম ON হওয়ার মুহূর্ত"
    const latestChangeMs = Math.max(
      ...devices.map((d) => new Date(d.lastChanged).getTime())
    );
    const onDurationMs = now.getTime() - latestChangeMs;

    if (onDurationMs >= CONTINUOUS_ON_MS) {
      alerts.push({
        type: "continuous-on",
        room: roomKey,
        message: `All devices in ${ROOM_CONFIG[roomKey].label} have been ON continuously for over 2 hours`,
        timestamp: now.toISOString(),
      });
    }
  }

  return alerts;
}

// Proactive Discord notification-এর জন্য: আগে notify করা alert-গুলো ট্র্যাক রাখা,
// যাতে বারবার একই alert পাঠিয়ে spam না হয়।
const notifiedKeys = new Set();

function alertKey(alert) {
  return `${alert.type}-${alert.room}-${alert.deviceId || ""}`;
}

function getNewAlerts() {
  const current = getActiveAlerts();
  const fresh = current.filter((a) => !notifiedKeys.has(alertKey(a)));
  fresh.forEach((a) => notifiedKeys.add(alertKey(a)));
  return fresh;
}

export { getActiveAlerts, getNewAlerts, isWithinOfficeHours };