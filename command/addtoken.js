const { SlashCommandBuilder, GuildChannelManager } = require("discord.js");
const { client } = require("../constants/allintents");
const fs = require("fs");
const {addTokensTatsu} = require("../webscraptest.js")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("addtoken")
    .setDescription("To add a token")
    .addStringOption((option) =>
      option.setName("points").setDescription("points amount").setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName("file_csv")
          .setDescription("Select the csv file to upload")
          .setRequired(true)
  ),

  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true });
    const guildId = interaction.guild.id;
    const points = interaction.options.getString("points");
    const file = interaction.options.getAttachment("file_csv");
    const fileurl = file.url;
    const filedata = await fetch(fileurl);
    const filecontent = await filedata.text();
    const rows = filecontent.split("\n");
    let count = 0
    for (const row of rows.slice(1)) {
      let userId = row.split(",")[0].slice(1);
      let status = row.split(",")[3];

      if (status == "not eligible") {
        let isAdded = await addTokensTatsu({guildId: guildId, userId: userId, points: points});
        console.log(isAdded)
        count++
      }
    }
    await interaction.editReply({ content: `Tokens added for ${count} users`, ephemeral: true });
  },
};




// tatsu bot api - nA3DJHOb10-i7XqFFVq8hBxAgKTT4PJF0