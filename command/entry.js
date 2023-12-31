const { SlashCommandBuilder, GuildChannelManager } = require("discord.js");
const db = require("../constants/firebase-setup");
const { getChannelsfromDoc } = require("../functions/firefunc");
const { validatePost } = require("../functions/validatepost");

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
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply();
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
      const { docRef, doc, id, tags, isSocial } = await retrieveDoc({
        guildId: interaction.guildId,
        parentId: parent?.parentId,
        channelId: interaction.channelId,
      });
      if (
        doc.data()[`${id}`].event_entries[`${userId}`] === undefined ||
        doc.data()[`${id}`].event_entries[`${userId}`] === null
      ) {
        const isRegAllowed = verifypostdate(
          doc.data()[`${id}`].lastDateToRegister
        );

        const today = verifypostdate(new Date().getTime());
        if (
          isRegAllowed.date < today.date &&
          isRegAllowed.month <= today.month &&
          isRegAllowed.year <= today.year
        ) {
          return await interaction.editReply({
            content: "Registration is closed",
            ephemeral: true,
          });
        }
      }

      if (
        doc.data()[`${id}`].event_entries[`${userId}`] !== undefined ||
        doc.data()[`${id}`].event_entries[`${userId}`] !== null
      ) {
        const checkLastEntryDate = verifypostdate(
          doc.data()[`${id}`]?.event_entries[`${userId}`]?.lastEntryDate
        );
        const today = verifypostdate(new Date().getTime());
        streak_mark = doc.data()[`${id}`]?.event_entries[`${userId}`]?.streak;
        if (
          today.date == checkLastEntryDate.date &&
          today.month == checkLastEntryDate.month &&
          today.year == checkLastEntryDate.year
        ) {
          return interaction.editReply({
            content:
              "You have already posted today. Your Total Streak is " +
              streak_mark +
              ".",
            ephemeral: true,
          });
        } else if (today.date - checkLastEntryDate.date > 1) {
          return await interaction.editReply({
            content: "You have missed a day. Streak broken. Well Tried...",
            ephemeral: true,
          });
        }
      }
      let validation = false;
      const checkisLinkPresent = isLinkPresent(name);
      if (!checkisLinkPresent?.link && isSocial === true) {
        return await interaction.editReply({
          content:
            "❌invalid format! entry not added.❌\n ----------------------------------\nPlease submit **twitter** or **linkedin** post link for the verification.\n ----------------------------------\n",
          ephemeral: true,
        });
      }
      if (checkisLinkPresent?.tweetId && checkisLinkPresent?.link) {
        validation = await validatePost({
          post: {
            link: checkisLinkPresent?.link,
            tweetId: checkisLinkPresent?.tweetId,
          },
          tags: tags,
        });
      } else if (
        checkisLinkPresent?.link !== null &&
        checkisLinkPresent?.link?.includes("linkedin") &&
        checkisLinkPresent?.tweetId === null
      ) {
        validation = await validatePost({
          post: {
            link: checkisLinkPresent?.link,
            tweetId: checkisLinkPresent?.tweetId,
          },
          tags: tags,
        });
      } else if (checkisLinkPresent === false) {
        const tagsArr = tags.split(",");
        if (name.trim() !== "" && tagsArr.length > 0) {
          if (tagsArr.every((tag) => name.includes(tag))) {
            validation = true;
          } else {
            validation = false;
          }
        } else {
          validation = false;
        }
      }
      if (validation) {
        const file = interaction.options.getAttachment("attachment");
        await addEntry({
          guildId: interaction.guildId,
          channelId: id,
          userId: userId,
          docRef: docRef,
          username: postingUser,
          streak_mark: streak_mark || 0,
        });
        let msg = null;
        if (file === null) {
          msg = await interaction.editReply({
            content: `${name}`,
            fetchReply: true,
          });
        } else {
          msg = await interaction.editReply({
            content: `${name} ${file?.attachment}`,
            fetchReply: true,
          });
        }
        msg.react("✅");
        await interaction.followUp({
          content: "entry added Successfully ✅!",
          ephemeral: true,
        });
      } else {
        await interaction.editReply({
          content:
            "❌invalid format! Please check hashtags. entry not added.❌",
          ephemeral: true,
        });
      }
    } else {
      await interaction.editReply({
        content: "cannot use this command here.",
        ephemeral: true,
      });
      return;
    }
  },
};

const isLinkPresent = (msg) => {
  const extract = extractLink(msg);
  if (extract === null) return false;
  return extract;
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
  if (link?.includes("linkedin.com")) {
    return { link: link, tweetId: null };
  } else if (link.includes("twitter.com") || link.includes("x.com")) {
    tweetId = link.match(/\/status\/(\d+)/)[1] || null;
    if (tweetId === null) {
      return null;
    }
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
  return {
    docRef: docRef,
    doc: doc,
    id: id,
    tags: doc.data()[`${id}`].tags,
    isSocial: doc.data()[`${id}`].isSocial,
  };
};
const verifypostdate = (d) => {
  const ds = new Date(d);
  return { date: ds.getDate(), month: ds.getMonth(), year: ds.getFullYear() };
};
