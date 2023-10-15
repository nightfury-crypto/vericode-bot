const { SlashCommandBuilder } = require("discord.js");
const { join } = require("path");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const db = require("../constants/firebase-setup")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mystreak")
    .setDescription("this will dm you about your progress in current event")
    .addChannelOption((option) =>
        option.setName("channel").setDescription("mention channel name").setRequired(true)
        )
    .setDMPermission(true),

  run: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({
      content: "wearing shoes.. coming",
        ephemeral: true,
    });
    const guildId = interaction.guildId;
    const user = interaction.user;
    const channel = interaction.options.getChannel("channel");

    const data = await fetchStreak({ guildId, channelId: channel.id});
    if (data === null) return await interaction.editReply({ content: "No event from this channel", ephemeral: true });
    const customembed = new EmbedBuilder()
      // embed
      .setColor(0x0099ff)
      .setTitle(`VeriCode Bot`)
      .setURL(
        "https://discord.com/api/oauth2/authorize?client_id=1157932141427048521&permissions=8&scope=bot%20applications.commands"
      )
      .setAuthor({
        name: `karnail Singh Choudhary`,
        iconURL: 'https://cdn.discordapp.com/avatars/532471253349564417/2dc4188b09760a470a01ef5b78da2e7b.webp?size=160',
      })
      .setDescription(`Hey ${user?.username}! Here is your progress in ${channel.name}`)
      .setThumbnail('https://raw.githubusercontent.com/nightfury-crypto/vericode-bot/main/assets/img/logo2.jpeg')
      .addFields(
        { name: "\u200B", value: "\u200B" },
        { name: `**🔥PROGRESS🔥**`, value: "\u200B" }
      )
      .addFields(
        {
          name: "`YOUR STREAK` - " + `${data?.event_entries[user.id]?.streak}`,
          value: `Your current streak in ${data?.eventName} event`,
        },
        {
          name: "`Last Entry - `" + `${formatDate(data?.event_entries[user.id]?.lastEntryDate)}`,
          value: checkIspending(data?.event_entries[user.id]?.lastEntryDate),
        },
        { name: "\u200B", value: "\u200B" },
      )
      .setTimestamp(new Date())
      .setFooter({
        text: `ig_toothless__`,
        iconURL: 'https://cdn.discordapp.com/avatars/532471253349564417/2dc4188b09760a470a01ef5b78da2e7b.webp?size=160',
      });
    // embed ends here
    await interaction.user.send({ embeds: [customembed] });
    await interaction.editReply({ content: "Progress sent in your DM", ephemeral: true });
  },
};


const fetchStreak = async ({guildId, channelId}) => {
    const querySnapshot = await db.collection("events").doc(guildId).get();
    if (querySnapshot.data()[`${channelId}`]) {
      return querySnapshot.data()[`${channelId}`];
    } else {
      return null;
    }
}

const formatDate = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dt = date.getDate();
    return `${dt}/${month}/${year}`;
}

const checkIspending = (d) => {
    if (d === null) return "You haven't entered yet";
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dt = date.getDate();
    const today = new Date();
    const todayyear = today.getFullYear();
    const todaymonth = today.getMonth() + 1;
    const todaydt = today.getDate();
    if (year === todayyear && month === todaymonth && dt === todaydt) {
        return "You have entered today";
    } else {
        return "You haven't entered today";
    }
}