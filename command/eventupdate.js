const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  channelMention,
} = require("discord.js");
const db = require("../constants/firebase-setup");
const { FieldValue, Timestamp } = require("firebase-admin").firestore;
const { getChannelsfromDoc } = require("../functions/firefunc");
const { create_event_modal } = require("../components/EventModal");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eventupdate")
    .setDescription("update event")
    .addChannelOption((option) =>
      option.setName("channel_name").setDescription("channel").setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator || PermissionFlagsBits.ModerateMembers
    ),

  run: async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return;
    let store = null;
    const customId = `eventModal-${interaction.user.id}`;
    let event_Name = "";
    let eventStartDate = "";
    let eventEndDate = "";
    let lastDateToRegister = "";
    let tags = "";
    let event_entries = [];
    let isSocial = false;
    let event_Id  = "";
    const channelname = interaction.options.getChannel("channel_name");
    const channelToMention = channelMention(channelname).slice(2, -1);
    const modalDatafetch = await db
      .collection("events")
      .doc(interaction.guildId)
      .get();
    if (modalDatafetch.exists) {
        if (modalDatafetch.data()[`${channelToMention.slice(2, -1)}`]) {
            store = modalDatafetch.data()[`${channelToMention.slice(2, -1)}`];
        } else {
            store = null;
        }
    } else {
        return await interaction.reply({
            content: "No event to update. Please create event first using\n `/eventadd --channel_name <channel>`",
            ephemeral: true,
          });
    }
    if (store == undefined || store == null) {
      return await interaction.reply({
        content: "No event from this channel",
        ephemeral: true,
      });
    }

    if (store) {
      event_Name = store.eventName;
      eventStartDate = getDateforModal(store.startDate);
      eventEndDate = getDateforModal(store.endDate);
      lastDateToRegister = getDateforModal(store.lastDateToRegister);
      tags = store.tags;
      event_entries = store.event_entries;
      isSocial = store.isSocial;
      event_Id = store.event_Id;
    }
    const getModalData = await create_event_modal({
      userId: interaction.user.id,
      eventName: event_Name.toString(),
      eStartDate: eventStartDate.toString(),
      eEndDate: eventEndDate.toString(),
      eLastDate: lastDateToRegister.toString(),
      eTags: tags,
      title: "Update",
    });
    await interaction.showModal(getModalData);
    const filter = (interaction) =>
      customId === `eventModal-${interaction.user.id}`;
    interaction
      .awaitModalSubmit({ filter, time: 90_000 })
      .then(async (modalinteraction) => {
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
          if ( lastDateToRegister < eventStartDate || lastDateToRegister > eventEndDate) {
            return await modalinteraction.editReply({
              content: "Last date to register can be between event start date and event end date",
              ephemeral: true,
            });
          } else if (
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
            createEvent({
              guildId: interaction.guildId,
              channelId: channelToMention.slice(2, -1),
              startDate: eventStartDate,
              endDate: eventEndDate,
              eventName: event_Name,
              lastDateToRegister: lastDateToRegister,
              event_Id: event_Id,
              isSocial: isSocial,
              event_entries: event_entries,
              tags: tags,
              event_createdAt: FieldValue.serverTimestamp(),
            });
            await modalinteraction.editReply({
              content: `event updated in ${channelToMention}`,
              ephemeral: true,
            });
        }
      })
      .catch((err) => {
        return;
      });
  },
};

// create event in firestore
const createEvent = async ({
  guildId,
  channelId,
  startDate,
  endDate,
  eventName,
  tags,
  lastDateToRegister,
  isSocial,
  event_entries,
  event_Id,
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
          event_Id: event_Id,
          startDate: startDate,
          lastDateToRegister: lastDateToRegister,
          endDate: endDate,
          eventName: eventName,
          event_entries: event_entries,
          isSocial: isSocial,
          tags: tags,
          created_at: Timestamp.fromDate(new Date()),
        },
      })
      .then(() => {
        return;
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
          event_Id: event_Id,
          startDate: startDate,
          lastDateToRegister: lastDateToRegister,
          endDate: endDate,
          eventName: eventName,
          event_entries: event_entries,
          isSocial: isSocial,
          tags: tags,
          created_at: Timestamp.fromDate(new Date()),
        },
      })
      .then(() => {
        return;
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



//   getDateforModal
const getDateforModal = (date) => {
    let dateObj = new Date(date);
    let toshow = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
    return toshow;
}

const verifypostdate = (d) => {
  const ds = new Date(d);
  return { date: ds.getDate(), month: ds.getMonth(), year: ds.getFullYear() };
};
