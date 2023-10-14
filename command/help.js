const { SlashCommandBuilder } = require("discord.js");
const { join } = require("path");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("this will dm you info about bot and its commands"),

  run: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({
      content: "wearing shoes.. coming",
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
      .setDescription('I am not a bot, I am a human with some superpowers. A can manage your events, entries and tokens distribution.')
      .setThumbnail('https://cdn5.vectorstock.com/i/1000x1000/34/89/qr-code-icon-black-scan-logo-barcode-vector-40743489.jpg')
      .addFields(
        { name: "\u200B", value: "\u200B" },
        { name: `**🔥About my COMMANDS🔥**`, value: "\u200B" }
      )
      .addFields(
        {
          name: "**/eventadd --channel_name**",
          value: "To create an event. Admin or moderator only",
        },
        {
          name: "**/eventupdate --channel_name**",
          value: "To update an event. Admin or moderator only",
        },
        {
          name: "**/eventdelete --channel_name**",
          value: "To delete an event. Admin or moderator only",
        },
        {
          name: "**/entry --content**",
          value:
            "To enter an event and to post entries. Everyone can use this command [participants]",
        },
        {
          name: "**/addtoken --points --csv_file**",
          value:
            "To add tokens to users. Admin or moderator only having guildmanager role",
        },
        {
          name: "**/export --channel_name**",
          value:
            "To export all entries of an event into csv file. Admin or moderator only",
        }
      )
      .setImage('https://archive.smashing.media/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/d0a4481f-e801-4cb7-9daa-17cdae32cc89/icon-design-21-opt.png')
      .setTimestamp()
      .setFooter({
        text: `ig_toothless__`,
        iconURL: 'https://archive.smashing.media/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/d0a4481f-e801-4cb7-9daa-17cdae32cc89/icon-design-21-opt.png',
      });
    // embed ends here
    await interaction.editReply({ embeds: [customembed] });
  },
};
