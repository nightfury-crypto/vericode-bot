const {
  SlashCommandBuilder,
  GuildChannelManager,
  PermissionFlagsBits,
} = require("discord.js");
const { client } = require("../constants/allintents");
const fs = require("fs");
const { addTokensTatsu } = require("../functions/tatsufunc");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("addtoken")
    .setDescription("To add a token")
    .addStringOption((option) =>
      option.setName("points").setDescription("points amount").setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("file_csv")
        .setDescription("Select the csv file to upload")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator ||
        PermissionFlagsBits.ModerateMembers ||
        PermissionFlagsBits.ManageGuild
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply();
    const guildId = interaction.guild.id;
    const points = interaction.options.getString("points");
    const file = interaction.options.getAttachment("file_csv");
    if (file.contentType.includes("text/csv")) {
      const fileurl = file.url;
      const filedata = await fetch(fileurl);
      const filecontent = await filedata.text();
      const rows = filecontent.split("\n");
      let success = 0;
      let fail = 0;
      let total = 0;
      let csvData1 = "id, usermame, streak, eligible status, points added\n";
      let csvData2 = "id, usermame, streak, eligible status, points added\n";

      for (const row of rows.slice(1)) {
        let userId = row.split(",")[0].slice(1);
        let username = row.split(",")[1];
        let streak = row.split(",")[2];
        let status = row.split(",")[3];

        if (status == "eligible") {
          let isAdded = await addTokensTatsu({
            guildId: guildId,
            userId: userId,
            points: points,
          });
          if (isAdded) {
            // edit csv file and change points added to true
            const rowData1 = [`'${userId}`, username, streak, status, true];
            csvData1 += rowData1.join(",") + "\n";
            success++;
          } else {
            const rowData2 = [`'${userId}`, username, streak, status, false];
            csvData2 += rowData2.join(",") + "\n";
            fail++;
          }
          total++;
        } else {
          continue;
        }
      }
      fs.writeFileSync("success.csv", csvData1);
      fs.writeFileSync("fail.csv", csvData2);
      if (success > 0 && fail == 0) {
        console.log("success");
        await interaction.editReply({
          content: `**Tokens added**\n **Success:** ${success} users\n **Fail:** ${fail} users\n **Total:** ${total} users`,
          files: ["success.csv"],
        });
      }
      else if (fail > 0 && success == 0) {
        console.log("fail");
        await interaction.editReply({
          content: `**Tokens added**\n **Success:** ${success} users\n **Fail:** ${fail} users\n **Total:** ${total} users`,
          files: ["fail.csv"],
        });
      }
      else if (success > 0 && fail > 0)   {
        console.log("both");
        await interaction.editReply({
          content: `**Tokens added**\n **Success:** ${success} users\n **Fail:** ${fail} users\n **Total:** ${total} users`,
          files: ["success.csv", "fail.csv"],
        });
      } else {
        await interaction.editReply({
          content: `**No one is eligible for tokens.**`,
        });
      }
    } else {
      await interaction.editReply({
        content: "Please upload a csv file",
        ephemeral: true,
      });
    }
  },
};