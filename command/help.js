const { SlashCommandBuilder } = require("discord.js");
const { join } = require("path");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("this will dm you info about bot and its commands")
    .setDMPermission(true),

  run: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({
      content: "wearing shoes.. coming",
        ephemeral: true,
    });
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
      .setDescription('I am not a bot, I am a human with some superpowers. I can manage your events, entries and tokens distribution.')
      .setThumbnail('https://raw.githubusercontent.com/nightfury-crypto/vericode-bot/main/assets/img/logo2.jpeg')
      .addFields(
        { name: "\u200B", value: "\u200B" },
        { name: `**🔥MY COMMANDS🔥**`, value: "\u200B" }
      )
      .addFields(
        {
          name: "`/eventadd `",
          value: "To create an event. Admin or moderator only",
          inline: true,
        },
        {
          name: "`/eventupdate `",
          value: "To update an event. Admin or moderator only",
        inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "`/eventdelete `",
          value: "To delete an event. Admin or moderator only",
        inline: true,
        },
        {
          name: "`/entry `",
          value:
            "To enter an event and to post entries. Everyone can use this command [participants]",
        inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "`/addtoken`",
          value:
            "To add tokens to users. Admin or moderator only having guildmanager role",
        inline: true,
        },
        {
          name: "`/export`",
          value:
            "To export all entries of an event into csv file. Admin or moderator only",
        inline: true,
        }
      )
      .setTimestamp(new Date())
      .setFooter({
        text: `ig_toothless__`,
        iconURL: 'https://cdn.discordapp.com/avatars/532471253349564417/2dc4188b09760a470a01ef5b78da2e7b.webp?size=160',
      });
    // embed ends here
    await interaction.user.send({ embeds: [customembed] });
    await interaction.editReply({ content: "check your dm", ephemeral: true });
  },
};
