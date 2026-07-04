// hooks/useSocket.js
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// backend-এর "state:update" event শুনে dashboard-এর জন্য একটা live snapshot রাখে।
// একই backend থেকে REST API আর socket দুটোই আসছে (single source of truth)।
function useSocket() {
  const [snapshot, setSnapshot] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(BACKEND_URL);
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("state:update", (data) => setSnapshot(data));

    return () => socket.disconnect();
  }, []);

  return { snapshot, connected };
}

export { useSocket, BACKEND_URL };