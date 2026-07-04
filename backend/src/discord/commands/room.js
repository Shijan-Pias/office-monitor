// discord/commands/room.js
import { getDevicesByRoom, ROOM_CONFIG } from "../../data/deviceStore.js";
import { humanize } from "../../llm/humanize.js";

async function handleRoom(message, args) {
  const roomKey = args[0]; // e.g. "!room work1" -> args = ["work1"]

  if (!roomKey || !ROOM_CONFIG[roomKey]) {
    message.reply(
      `Please specify a valid room: ${Object.keys(ROOM_CONFIG).join(", ")}. Example: \`!room work1\``
    );
    return;
  }

  const devices = getDevicesByRoom(roomKey);
  const rawSummary = devices
    .map((d) => `${d.label}: ${d.status.toUpperCase()}`)
    .join(", ");

  const reply = await humanize(
    `Room: ${ROOM_CONFIG[roomKey].label}. Devices: ${rawSummary}`,
    "Describe this specific room's current device status in a friendly way."
  );

  message.reply(reply);
}

export { handleRoom };