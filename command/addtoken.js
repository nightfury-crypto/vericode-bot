const { SlashCommandBuilder, GuildChannelManager } = require("discord.js");
const { client } = require("../constants/allintents");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addtoken")
    .setDescription("To add a token")
    .addAttachmentOption(option =>
      option.setName("file_csv")
          .setDescription("Select the csv file to upload")
          .setRequired(true)
  ),

  run: async ({ interaction }) => {
    console.log(interaction.options.getAttachment("file_csv"))
    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;
        interaction.reply({
          content: "/points give user:@ig_toothless__ count:20000",
          ephemeral: false,
        });
  },
};


// tatsu bot api - nA3DJHOb10-i7XqFFVq8hBxAgKTT4PJF0