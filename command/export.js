const { SlashCommandBuilder, GuildChannelManager } = require("discord.js");
const { client } = require("../constants/allintents");
const db = require("../constants/firebase-setup");
const fs = require("fs");
const { Parser } = require("@json2csv/plainjs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("export")
    .setDescription("attach channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("mention the channel")
        .setRequired(true)
    ),

  run: async ({ interaction }) => {
    const channel = interaction.options.getChannel("channel");
    let csvData = ["id", "username", "streak", "status\n"];
    const data = await retrieveData({
      guildId: interaction.guildId,
      channelId: channel.id,
    });
    if (data !== null) {
      const event_total_days = calculateDate(data.startDate, data.endDate);
      if (data.event_entries) {
        for (const userId in data.event_entries) {
          const entry = data.event_entries[userId];
          const rowData = [
            `'${userId}`,
            entry.username,
            entry.entry.length,
            entry.length == event_total_days ? "eligible" : "not eligible",
          ];
          csvData += rowData.join(",") + "\n";
        }
      }
      const checkFile = fs.writeFileSync("output.csv", csvData);
      interaction.reply({ content: "file exported", files: ["output.csv"] });
    } else {
      interaction.reply({ content: "No event from this channel", ephemeral: true });
    }
    
  },
};

const retrieveData = async ({ guildId, channelId }) => {
  const querySnapshot = await db.collection("events").doc(guildId).get();
  if (querySnapshot.data()[`${channelId}`]) {
    return querySnapshot.data()[`${channelId}`];
  } else {
    return null;
  }
};

// calculate days
const calculateDate = (sDate, eDate) => {
  const startDate = new Date(sDate);
  const endDate = new Date(eDate);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};