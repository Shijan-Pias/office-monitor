// sockets/index.js
// ----------------------------------------------------------------
// এই ফাইলটা socket.io এর connection events handle করে।
// মূল কাজ: যখনই কোনো নতুন client (dashboard) কানেক্ট করে,
// তাকে সাথে সাথে বর্তমান state পাঠিয়ে দেওয়া (যাতে refresh করলেও
// প্রথমেই latest data দেখা যায়, পরের tick এর জন্য অপেক্ষা করতে না হয়)।
// ----------------------------------------------------------------

import { buildSnapshot } from "./simulator.js";

function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`[socket] client connected: ${socket.id}`);

    // নতুন client কানেক্ট হওয়ার সাথে সাথেই current snapshot পাঠাও
    socket.emit("state:update", buildSnapshot());

    socket.on("disconnect", () => {
      console.log(`[socket] client disconnected: ${socket.id}`);
    });
  });
}

export { registerSocketHandlers };