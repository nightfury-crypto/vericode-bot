const { SlashCommandBuilder, GuildChannelManager } = require("discord.js");
const store = require("../constants/storethings");
const { client } = require("../constants/allintents");
const parse = require("twitter-url-parser");
const { retriveTweet } = require("../functions/twitterparse");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("entry")
    .setDescription("Follow the format strictly")
    .addStringOption((option) =>
      option.setName("content").setDescription("the format").setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("attachment")
        .setDescription("upload the file")
        .setRequired(false)
    ),

  run: async ({ interaction }) => {
    const managechannel = new GuildChannelManager(interaction.guild);
    // getting parent channel id
    const parent = await managechannel.fetch(interaction.channelId);
    const name = interaction.options.getString("content");

    if (
      store.channels.includes(parent?.parentId) ||
      store.channels.includes(interaction.channelId)
    ) {
      const checkValidity = await validatemsg(name);
      if (checkValidity) {
        const msg = await interaction.reply({
          content: name,
          fetchReply: true,
        });
        msg.react("✅");
        await interaction.followUp({
          content: "entry added Successfully ✅!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "invalid format! entry not added.",
          ephemeral: true,
        });
      }
    } else {
      interaction.reply({
        content: "cannot use this command here.",
        ephemeral: true,
      });
      return;
    }
  },
};
// validate format
const validatemsg = async (msg) => {
  const link = extractLink(msg);
  if (link?.link !== null) {
    console.log(link);
    return true;
  }


};

// const parseUsername = (url) => {
//   if (url.includes("twitter.com")) {
//     return url.match(/twitter.com\/(.*)\/status/)[1];
//   }
//   if (url.includes("linkedin.com")) {
//     check = "https://www.linkedin.com/posts/2thless_twitter-logo-using-html-css-ig-https-activity-7097493008421392384-23bF?utm_source=share&utm_medium=member_desktop"
//     const userstr = check.match(/linkedin\.com\/posts\/([^/?]+)/)[1];
//     const username = userstr.split("_")[0];
//     return "2thless_"
//   }
// };

const extractLink = (msg) => {
  let link = null;
  let tweetId = null;
  const startIndex = msg.indexOf("http");
  const endIndex = msg.substring(startIndex, msg.length).indexOf(" ");
  if (endIndex > startIndex) {
    link = msg.substring(startIndex, endIndex + startIndex).trim();
  } else {
    link = msg.substring(startIndex, msg.length).trim();
  }
  tweetId = link.match(/\/status\/(\d+)/)[1] || null;
  return { link: link, tweetId: tweetId };
};
