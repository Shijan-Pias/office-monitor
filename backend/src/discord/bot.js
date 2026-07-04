// discord/bot.js
import { Client, GatewayIntentBits } from "discord.js";
import { handleStatus } from "./commands/status.js";
import { handleRoom } from "./commands/room.js";
import { handleUsage } from "./commands/usage.js";
import { getNewAlerts } from "../alerts/alertEngine.js";

const PREFIX = "!";

function startDiscordBot() {
  if (!process.env.DISCORD_TOKEN) {
    console.warn("[discord] DISCORD_TOKEN not set, skipping bot startup");
    return null;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.once("ready", () => {
    console.log(`[discord] logged in as ${client.user.tag}`);

    // Bonus: প্রতি ৩০ সেকেন্ডে নতুন alert চেক করে designated channel-এ পাঠানো
    if (process.env.ALERT_CHANNEL_ID) {
      setInterval(async () => {
        const newAlerts = getNewAlerts();
        if (newAlerts.length === 0) return;

        const channel = await client.channels.fetch(process.env.ALERT_CHANNEL_ID).catch(() => null);
        if (!channel) return;

        for (const alert of newAlerts) {
          channel.send(`⚠️ ${alert.message}`);
        }
      }, 30000);
    }
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const [command, ...args] = message.content.slice(PREFIX.length).trim().split(/\s+/);

    if (command === "status") await handleStatus(message);
    else if (command === "room") await handleRoom(message, args);
    else if (command === "usage") await handleUsage(message);
  });

  // login fail করলেও (bad token, no network) যেন পুরো backend crash না করে —
  // dashboard/API চলতেই থাকবে, শুধু bot অংশটা কাজ করবে না
  client.login(process.env.DISCORD_TOKEN).catch((err) => {
    console.error("[discord] login failed, bot disabled:", err.message);
  });

  return client;
}

export { startDiscordBot };