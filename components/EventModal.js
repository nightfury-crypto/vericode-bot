const {
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder,
    ActionRowBuilder,
  } = require("discord.js");

const create_event_modal = async ({eventName, eStartDate, eEndDate, eLastDate, eTags, userId}) => {
  const modal = new ModalBuilder()
    .setCustomId(`eventModal-${userId}`)
    .setTitle("Create Event");

  // Create the text input components
  const eventNameInput = new TextInputBuilder()
    .setCustomId("event_name_id")
    .setLabel("Event Name")
    .setPlaceholder("scaler-event")
    .setValue(eventName)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const eventStartInput = new TextInputBuilder()
    .setCustomId("start_date_id")
    .setLabel("Event Start Date (mm/dd/yyyy)")
    .setPlaceholder("mm/dd/yyyy")
    .setValue(eStartDate)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const eventEndInput = new TextInputBuilder()
    .setCustomId("end_date_id")
    .setLabel("Event End Date (mm/dd/yyyy)")
    .setPlaceholder("mm/dd/yyyy")
    .setValue(eEndDate)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const lastDateToRegisterInput = new TextInputBuilder()
    .setCustomId("last_entry_id")
    .setLabel("Registration last date (mm/dd/yyyy)")
    .setPlaceholder("mm/dd/yyyy")
    .setValue(eLastDate)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const tagsInput = new TextInputBuilder()
    .setCustomId("tags_id")
    .setLabel("Keywords (comma separated)")
    .setPlaceholder("scaler, #ScalerDiscord, #ScalerAcademy...")
    .setValue(eTags)
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  // so you need one action row per text input.
  const firstActionRow = new ActionRowBuilder().addComponents(eventNameInput);
  const secondActionRow = new ActionRowBuilder().addComponents(eventStartInput);
  const thirdActionRow = new ActionRowBuilder().addComponents(eventEndInput);
  const fourthActionRow = new ActionRowBuilder().addComponents(
    lastDateToRegisterInput
  );
  const fifthActionRow = new ActionRowBuilder().addComponents(tagsInput);

  // Add inputs to the modal
  modal.addComponents(
    firstActionRow,
    secondActionRow,
    thirdActionRow,
    fourthActionRow,
    fifthActionRow
  );
  return modal;
};

module.exports = { create_event_modal };
