const { SlashCommandBuilder, GuildChannelManager, PermissionFlagsBits } = require("discord.js");
const { client } = require("../constants/allintents");
const fs = require("fs");
const {addTokensTatsu} = require("../functions/tatsufunc")
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
  )
  .setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator || PermissionFlagsBits.ModerateMembers || PermissionFlagsBits.ManageGuild
  ),

  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true });
    const guildId = interaction.guild.id;
    const points = interaction.options.getString("points");
    const file = interaction.options.getAttachment("file_csv");
    if (file.contentType.includes("text/csv")) {
    const fileurl = file.url;
    const filedata = await fetch(fileurl);
    const filecontent = await filedata.text();
    const rows = filecontent.split("\n");
    let success = 0
    let fail = 0
    let total = 0;
    for (const row of rows.slice(1)) {
      let userId = row.split(",")[0].slice(1);
      let status = row.split(",")[3];

      if (status == "not eligible") {
        let isAdded = await addTokensTatsu({guildId: guildId, userId: userId, points: points});
        if (isAdded) {
          success++;
        } else {
          fail++;
        }
        total++
      }
    }
    await interaction.editReply({ content: `**Tokens added**\n **Success:** ${success} users\n **Fail:** ${fail} users\n **Total:** ${total} users`, ephemeral: true });
    } else {
      await interaction.editReply({ content: "Please upload a csv file", ephemeral: true });
    }
  },
};




// tatsu bot api - nA3DJHOb10-i7XqFFVq8hBxAgKTT4PJF0