// deviceStore.js
// ----------------------------------------------------------------
// এই ফাইলটাই পুরো সিস্টেমের "Source of Truth"।
// এখানে ১৫টা ডিভাইসের বর্তমান অবস্থা (state) in-memory তে রাখা হয়।
// Dashboard (Socket.io দিয়ে) আর Discord bot দুইজনই এই একই object
// থেকে data পড়বে, তাই কোনো mismatch হবে না।
// ----------------------------------------------------------------

// প্রতিটা রুমে কয়টা ফ্যান আর লাইট আছে (PDF অনুযায়ী fixed)
const ROOM_CONFIG = {
  drawing: { label: "Drawing Room", fans: 2, lights: 3 },
  work1: { label: "Work Room 1", fans: 2, lights: 3 },
  work2: { label: "Work Room 2", fans: 2, lights: 3 },
};

// Power draw per device type (PDF spec অনুযায়ী)
const WATTAGE = {
  fan: 60,
  light: 15,
};

// -------- ধাপ ১: শুরুতে ১৫টা ডিভাইসের initial state বানানো --------
// আমরা একটা flat array রাখব, প্রতিটা device একটা object:
// { id, room, type, index, status, watt, lastChanged }
function buildInitialDevices() {
  const devices = [];

  for (const [roomKey, config] of Object.entries(ROOM_CONFIG)) {
    // ফ্যানগুলো তৈরি
    for (let i = 1; i <= config.fans; i++) {
      devices.push({
        id: `${roomKey}-fan-${i}`,
        room: roomKey,
        type: "fan",
        label: `Fan ${i}`,
        status: "off", // সব শুরুতে অফ থাকে
        watt: WATTAGE.fan,
        lastChanged: new Date().toISOString(),
      });
    }
    // লাইটগুলো তৈরি
    for (let i = 1; i <= config.lights; i++) {
      devices.push({
        id: `${roomKey}-light-${i}`,
        room: roomKey,
        type: "light",
        label: `Light ${i}`,
        status: "off",
        watt: WATTAGE.light,
        lastChanged: new Date().toISOString(),
      });
    }
  }

  return devices;
}

// এই একটা variable-ই পুরো backend-এর "state"। মনে রাখো, এটা
// শুধু একটা JS array যেটা RAM-এ থাকে — সার্ভার রিস্টার্ট হলে
// রিসেট হয়ে যাবে। Demo/hackathon-এর জন্য এটাই যথেষ্ট।
let devices = buildInitialDevices();

// ট্র্যাক করব আজকের মোট energy usage (kWh হিসাব করার জন্য)
// সহজ approach: প্রতি সেকেন্ডে যা যা device ON ছিল তার watt যোগ করে
// accumulate করব। শুরুতে ০।
let cumulativeWattSeconds = 0;
let lastTickTime = Date.now();

// -------- ধাপ ২: Getter functions (data পড়ার জন্য) --------

function getAllDevices() {
  return devices;
}

function getDevicesByRoom(roomKey) {
  return devices.filter((d) => d.room === roomKey);
}

function getRoomList() {
  return Object.entries(ROOM_CONFIG).map(([key, cfg]) => ({
    key,
    label: cfg.label,
  }));
}

// এই মুহূর্তে মোট কত watt খরচ হচ্ছে (শুধু ON থাকা device গুলোর যোগফল)
function getCurrentTotalWatt() {
  return devices
    .filter((d) => d.status === "on")
    .reduce((sum, d) => sum + d.watt, 0);
}

// রুম-ভিত্তিক breakdown: { drawing: 120, work1: 0, work2: 75 }
function getWattByRoom() {
  const result = {};
  for (const roomKey of Object.keys(ROOM_CONFIG)) {
    result[roomKey] = getDevicesByRoom(roomKey)
      .filter((d) => d.status === "on")
      .reduce((sum, d) => sum + d.watt, 0);
  }
  return result;
}

// আজকের আনুমানিক kWh usage
function getEstimatedKwhToday() {
  // watt-seconds কে watt-hours এ কনভার্ট করে, তারপর kWh
  return cumulativeWattSeconds / 3600 / 1000;
}

// -------- ধাপ ৩: State পরিবর্তনের ফাংশন --------

// একটা নির্দিষ্ট device-এর status flip করা (on <-> off)
function toggleDevice(deviceId) {
  const device = devices.find((d) => d.id === deviceId);
  if (!device) return null;

  device.status = device.status === "on" ? "off" : "on";
  device.lastChanged = new Date().toISOString();
  return device;
}

// র‍্যান্ডমলি কয়েকটা device-এর state পরিবর্তন করা (simulator-এর মূল কাজ)
function randomlyToggleDevices(count = 2) {
  const changed = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * devices.length);
    const device = devices[randomIndex];
    device.status = device.status === "on" ? "off" : "on";
    device.lastChanged = new Date().toISOString();
    changed.push(device);
  }
  return changed;
}

// প্রতি "tick"-এ energy accumulate করা (kWh হিসাবের জন্য)
// এটা setInterval থেকে নিয়মিত কল হবে
function accumulateEnergy() {
  const now = Date.now();
  const elapsedSeconds = (now - lastTickTime) / 1000;
  const currentWatt = getCurrentTotalWatt();

  cumulativeWattSeconds += currentWatt * elapsedSeconds;
  lastTickTime = now;
}

export {
  ROOM_CONFIG,
  getAllDevices,
  getDevicesByRoom,
  getRoomList,
  getCurrentTotalWatt,
  getWattByRoom,
  getEstimatedKwhToday,
  toggleDevice,
  randomlyToggleDevices,
  accumulateEnergy,
};