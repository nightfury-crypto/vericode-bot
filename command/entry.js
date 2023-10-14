const { SlashCommandBuilder, GuildChannelManager } = require("discord.js");
const { client } = require("../constants/allintents");
const { retriveTweet } = require("../functions/twitterparse");
const db = require("../constants/firebase-setup");
const { getChannelsfromDoc } = require("../functions/firefunc");
const { FieldValue } = require("firebase-admin").firestore;
const { fetchLinkedin } = require("../functions/linkedinfunc");

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
    let streak_mark = 0;
    // getting channel manager
    const managechannel = new GuildChannelManager(interaction.guild);
    // getting parent channel id
    const parent = await managechannel.fetch(interaction.channelId);
    const userId = interaction.user.id;
    let isChannelPresent = await getChannelsfromDoc({
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      parentId: parent?.parentId,
    });

    const name = interaction.options.getString("content");
    const postingUser = interaction.user.username;
    if (isChannelPresent) {
      const { docRef, doc, id } = await retrieveDoc({
        guildId: interaction.guildId,
        parentId: parent?.parentId,
        channelId: interaction.channelId,
      });
      if (
        doc.data()[`${id}`].event_entries[`${userId}`] !== undefined ||
        doc.data()[`${id}`].event_entries[`${userId}`] !== null
      ) {
        const isRegAllowed = doc.data()[`${id}`].lastDateToRegister;
        const checkLastEntryDate = verifypostdate(
          doc.data()[`${id}`]?.event_entries[`${userId}`]?.lastEntryDate
        );
        const today = verifypostdate(new Date().getTime());
        streak_mark = doc.data()[`${id}`]?.event_entries[`${userId}`]?.streak;

        if (
          isRegAllowed.date >= today.date &&
          isRegAllowed.month >= today.month &&
          isRegAllowed.year >= today.year
        ) {
          return await interaction.reply({
            content: "Registration is closed",
            ephemeral: true,
          });
        } else if (
          today.date == checkLastEntryDate.date &&
          today.month == checkLastEntryDate.month &&
          today.year == checkLastEntryDate.year
        ) {
          return interaction.reply({
            content:
              "You have already posted today. Your Total Streak is " +
              streak_mark +
              ".",
            ephemeral: true,
          });
        } else if (today.date - checkLastEntryDate.date > 1) {
          return await interaction.reply({
            content: "You have missed a day. Streak broken. Well Tried...",
            ephemeral: true,
          });
        }
      }
      let validation = false
      const checkisLinkPresent = isLinkPresent(name);
      if (checkisLinkPresent?.tweetId && checkisLinkPresent?.link) {
        validation = true
      } else if (checkisLinkPresent?.link && checkisLinkPresent?.tweetId === null) {
        validation = true
      } else if (checkisLinkPresent === false) {
        validation = true
      }
      if (validation) {
        await addEntry({
          guildId: interaction.guildId,
          channelId: id,
          userId: userId,
          docRef: docRef,
          username: postingUser,
          streak_mark: streak_mark || 0,
        });
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
      await interaction.reply({
        content: "cannot use this command here.",
        ephemeral: true,
      });
      return;
    }
  },
};

const isLinkPresent = (msg) => {
  console.log(msg);
  const extract = extractLink(msg);
  if (extract === null) return false;
  return extract?.link;
};
const extractLink = (msg) => {
  let link = null;
  let tweetId = null;
  const startIndex = msg.indexOf("http");
  if (startIndex === -1) {
    return null;
  }
  const endIndex = msg.substring(startIndex, msg.length).indexOf(" ");
  if (endIndex > startIndex) {
    link = msg.substring(startIndex, endIndex + startIndex).trim();
  } else {
    link = msg.substring(startIndex, msg.length).trim();
  }
  if (link.includes("linkedin.com")) {
    return { link: link, tweetId: null };
  } else if (link.includes("twitter.com")) {
    tweetId = link.match(/\/status\/(\d+)/)[1] || null;
    return { link: link, tweetId: tweetId };
  } else {
    return null;
  }
};

const addEntry = async ({
  guildId,
  channelId,
  userId,
  username,
  docRef,
  streak_mark,
}) => {
  // update docs
  docRef.update({
    [`${channelId}.event_entries`]: {
      [`${userId}`]: {
        userId: userId,
        username: username,
        streak: streak_mark + 1,
        lastEntryDate: new Date().getTime(),
      },
    },
  });
};

const retrieveDoc = async ({ guildId, parentId, channelId }) => {
  const docRef = db.collection("events").doc(guildId);
  const doc = await docRef.get();
  let id = "";

  if (doc.data()[`${parentId}`]) {
    id = parentId;
  } else {
    id = channelId;
  }
  return { docRef: docRef, doc: doc, id: id };
};
const verifypostdate = (d) => {
  const ds = new Date(d);
  return { date: ds.getDate(), month: ds.getMonth(), year: ds.getFullYear() };
};
