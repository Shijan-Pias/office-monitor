// discord/commands/status.js
import { getAllDevices, ROOM_CONFIG } from "../../data/deviceStore.js";
import { humanize } from "../../llm/humanize.js";

async function handleStatus(message) {
  const devices = getAllDevices();

  const roomSummaries = Object.keys(ROOM_CONFIG).map((roomKey) => {
    const roomDevices = devices.filter((d) => d.room === roomKey);
    const fansOn = roomDevices.filter((d) => d.type === "fan" && d.status === "on").length;
    const lightsOn = roomDevices.filter((d) => d.type === "light" && d.status === "on").length;
    return `${ROOM_CONFIG[roomKey].label}: ${fansOn} fan(s) ON, ${lightsOn} light(s) ON`;
  });

  const rawSummary = roomSummaries.join(". ");

  const reply = await humanize(
    rawSummary,
    "Summarize the current office status for all rooms in a friendly way."
  );

  message.reply(reply);
}

export { handleStatus };