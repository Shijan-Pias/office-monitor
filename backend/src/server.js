// server.js
// ----------------------------------------------------------------
// এটাই backend-এর entry point। এখানে সব piece একসাথে জোড়া লাগে:
// Express (REST API) + HTTP server + Socket.io (real-time) + simulator।
//
// npm run dev  দিয়ে চালাবে।
// ----------------------------------------------------------------

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config"; // .env ফাইল থেকে environment variables লোড করে

import apiRoutes from "./routes/api.js";
import { registerSocketHandlers } from "./sockets/index.js";
import { startSimulator } from "./sockets/simulator.js";
import { startDiscordBot } from "./discord/bot.js";

const PORT = process.env.PORT || 4000;

// ধাপ ১: Express app বানানো
const app = express();
app.use(cors()); // frontend আলাদা port থেকে call করবে, তাই CORS লাগবে
app.use(express.json());

// ধাপ ২: REST routes যুক্ত করা — সব API /api/... prefix দিয়ে শুরু হবে
app.use("/api", apiRoutes);

// health check endpoint (সার্ভার live আছে কিনা quick check করার জন্য)
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Office Monitor backend running" });
});

// ধাপ ৩: Express app-কে raw HTTP server-এ wrap করা।
// কেন? কারণ socket.io কে raw http server-এর সাথে attach করতে হয়,
// শুধু express app দিয়ে হয় না।
const httpServer = createServer(app);

// ধাপ ৪: Socket.io server বানানো, CORS allow করা
const io = new Server(httpServer, {
  cors: {
    origin: "*", // hackathon demo-র জন্য সব origin allow করছি
  },
});

// ধাপ ৫: socket connection handlers আর simulator চালু করা
registerSocketHandlers(io);
startSimulator(io);
startDiscordBot();

// ধাপ ৬: সার্ভার চালু করা
httpServer.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});