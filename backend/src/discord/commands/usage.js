// discord/commands/usage.js
import { getCurrentTotalWatt, getEstimatedKwhToday } from "../../data/deviceStore.js";
import { humanize } from "../../llm/humanize.js";

async function handleUsage(message) {
  const totalWatt = getCurrentTotalWatt();
  const kwhToday = getEstimatedKwhToday().toFixed(2);

  const rawSummary = `Total power right now: ${totalWatt}W. Today's estimated usage: ${kwhToday} kWh.`;

  const reply = await humanize(
    rawSummary,
    "Report the current live power usage and today's estimated energy consumption in a friendly way."
  );

  message.reply(reply);
}

export { handleUsage };