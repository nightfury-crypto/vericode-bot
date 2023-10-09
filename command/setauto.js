const { SlashCommandBuilder, PermissionFlagsBits, channelMention } = require("discord.js");
const store = require("../constants/storethings");
const {client} = require("../constants/allintents");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setauto")
    .setDescription("set automation")
    .addStringOption((option) =>
      option
        .setName("info")
        .setDescription("channel | isFormat | format-file  ")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator || PermissionFlagsBits.ModerateMembers),

  run: ({ interaction }) => {
    const info = interaction.options.getString("info").split(" ");
    let channelname = info[0].slice(2, info[0].length - 1);
    if (store.channels.includes(channelname) === false) {
      store.channels.push(channelname);
    }
    const channelToMention = channelMention(channelname);
    interaction.reply({ content: `Bot added in the ${channelToMention}`, ephemeral: true });
  },
};
