const { REST, Routes } = require("discord.js");
const { dotenv } = require("dotenv/config");
const path = require("path");
const { CommandHandler } = require("djs-commander");
const { client } = require("./constants/allintents");
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// to delete all commands
// rest
//   .put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
//   .then(() => console.log("Successfully deleted all application commands."))
//   .catch(console.error);

// message event
client.on("messageCreate", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

// slash command handler
new CommandHandler({
  client,
  eventsPath: path.join(__dirname, "events"),
  commandsPath: path.join(__dirname, "command"),
});

client.login(process.env.DISCORD_TOKEN);

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});