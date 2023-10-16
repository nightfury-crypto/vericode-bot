const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  channelMention,
} = require("discord.js");
const db = require("../constants/firebase-setup");
const { FieldValue, Timestamp } = require("firebase-admin").firestore;
const { getChannelsfromDoc } = require("../functions/firefunc");
const { create_event_modal} = require("../components/EventModal")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eventadd")
    .setDescription("create event")
    .addChannelOption((option) =>
      option.setName("channel_name").setDescription("channel").setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("social_post_bool")
        .setDescription("Twitter or Linkedin post link required? true/false | Once set, cannot be changed")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator || PermissionFlagsBits.ModerateMembers
    ),

  run: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    const customId = `eventModal-${interaction.user.id}`;
    let event_Name = "";
    let eventStartDate = "";
    let eventEndDate = "";
    let lastDateToRegister = "";
    let tags = "";
    let isSocial = false
    isSocial = interaction.options.getBoolean("social_post_bool");
    const getModalData = await create_event_modal({eventName: event_Name, eStartDate: eventStartDate, eEndDate: eventEndDate, eLastDate: lastDateToRegister, eTags: tags, userId: interaction.user.id, title: "Create"});

    await interaction.showModal(getModalData);
    const filter = (interaction) => 
      customId === `eventModal-${interaction.user.id}`;
    interaction
      .awaitModalSubmit({ filter, time: 90_000 })
      .then(async (modalinteraction) => {
        
        if (modalinteraction.isModalSubmit()) {
        await modalinteraction.deferReply({ ephemeral: true });
        event_Name =
          (await modalinteraction.fields.getTextInputValue("event_name_id")) ||
          null;
        eventStartDate =
          dateFormat(
            await modalinteraction.fields.getTextInputValue("start_date_id")
          ) || null;
        eventEndDate =
          dateFormat(
            await modalinteraction.fields.getTextInputValue("end_date_id")
          ) || null;
        lastDateToRegister =
          dateFormat(
            await modalinteraction.fields.getTextInputValue("last_entry_id")
          ) || null;
        tags =
          (await modalinteraction.fields.getTextInputValue("tags_id")) || "";
        if (
          eventStartDate === null ||
          eventEndDate === null ||
          lastDateToRegister === null ||
          eventStartDate === NaN ||
          eventEndDate === NaN ||
          lastDateToRegister === null ||
          lastDateToRegister === NaN
        ) {
          return await modalinteraction.editReply({
            content: "Please enter valid date - mm/dd/yyyy",
            ephemeral: true,
          });
        } else if (eventStartDate > eventEndDate) {
          return await modalinteraction.editReply({
            content: "Event start date cannot be greater than event end date",
            ephemeral: true,
          });
        } else {
          const channelname = interaction.options.getChannel("channel_name");
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
              tags: tags,
              isSocial: isSocial,
              event_createdAt: FieldValue.serverTimestamp(),
            });
            await modalinteraction.editReply({
              content: `Bot added in the ${channelToMention}`,
              ephemeral: true,
            });
          } else {
            modalinteraction.editReply({
              content: `Bot already added in the ${channelToMention}`,
              ephemeral: true,
            });
          }
        }
      } else {
        return;
      }
      })
      .catch((err) => {
        return;
      });
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
  lastDateToRegister,
  tags,
  isSocial,
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
          tags: tags,
          isSocial: isSocial,
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
        [`${channelId}`]: {
          event_Id: channelId,
          startDate: startDate,
          lastDateToRegister: lastDateToRegister,
          endDate: endDate,
          eventName: eventName,
          event_entries: [],
          tags: tags,
          isSocial: isSocial,
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
