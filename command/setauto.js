const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  channelMention,
} = require("discord.js");
const { client } = require("../constants/allintents");
const db = require("../constants/firebase-setup");
const { FieldValue, Timestamp } = require("firebase-admin").firestore;
const { getChannelsfromDoc } = require("../functions/firefunc");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setauto")
    .setDescription("set automation")
    .addStringOption((option) =>
      option
        .setName("event_info")
        .setDescription("['tag1', 'tag2', ...] | start_Date | end_Date | lastDateToRegister")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option.setName("channel_name").setDescription("channel").setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator || PermissionFlagsBits.ModerateMembers
    ),

  run: async ({ interaction }) => {
    const info = interaction.options.getString("event_info").split("|");
    const eventStartDate = dateFormat(info[1].trim()) || null;
    const eventEndDate = dateFormat(info[2].trim()) || null;
    const lastDateToRegister = dateFormat(info[3].trim()) || null;
    const channelname = interaction.options.getChannel("channel_name");
    const event_Name = channelname?.name;
    const channelToMention = channelMention(channelname).slice(2, -1);
    const isChannelPresent = await getChannelsfromDoc({
      guildId: interaction.guildId,
      channelId: channelToMention.slice(2, -1),
      parentId: null,
    });
    if (!isChannelPresent) {
      createEvent({
        guildId: interaction.guildId,
        channelId: channelToMention.slice(2, -1),
        startDate: eventStartDate,
        endDate: eventEndDate,
        eventName: event_Name,
        lastDateToRegister: lastDateToRegister,
        event_createdAt: FieldValue.serverTimestamp(),
      });
      interaction.reply({
        content: `Bot added in the ${channelToMention}`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: `Bot already added in the ${channelToMention}`,
        ephemeral: true,
      });
    }
  },
};

// add channel id in firestore
const createChannelArr = async ({ guildId, channelId }) => {
  const docRef = db.collection("manage_channel").doc(guildId);
  const doc = await docRef.get();
  if (doc.exists) {
    await db
      .collection("manage_channel")
      .doc(guildId)
      .update({
        storeChannels: FieldValue.arrayUnion(channelId),
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  } else {
    await db
      .collection("manage_channel")
      .doc(guildId)
      .set({
        storeChannels: FieldValue.arrayUnion(channelId),
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }
};

// create event in firestore
const createEvent = async ({
  guildId,
  channelId,
  startDate,
  endDate,
  eventName,
  lastDateToRegister
}) => {
  // read db data from firestore
  const docRef = db.collection("events").doc(guildId);
  const doc = await docRef.get();
  if (doc.exists) {
    await db
      .collection("events")
      .doc(guildId)
      .update({
        [`${channelId}`]: {
          event_Id: channelId,
          startDate: startDate,
          lastDateToRegister: lastDateToRegister,
          endDate: endDate,
          eventName: eventName,
          event_entries: [],
          created_at: Timestamp.fromDate(new Date()),
        },
      })
      .then(() => {
        createChannelArr({ guildId: guildId, channelId: channelId });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  } else {
    await db
      .collection("events")
      .doc(guildId)
      .set({
        [`${channelId}`] : {
          event_Id: channelId,
          startDate: startDate,
          lastDateToRegister: lastDateToRegister,
          endDate: endDate,
          eventName: eventName,
          event_entries: [],
          created_at: Timestamp.fromDate(new Date()),
        },
      })
      .then(() => {
        createChannelArr({ guildId: guildId, channelId: channelId });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }
};

const dateFormat = (date) => {
  if (date === null) {
    return null;
  }
  return new Date(date).getTime();
};
