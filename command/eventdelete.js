const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    channelMention,
  } = require("discord.js");
  const db = require("../constants/firebase-setup");
  const { FieldValue, Timestamp } = require("firebase-admin").firestore;
  const { create_event_modal } = require("../components/EventModal");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("eventdelete")
      .setDescription("delete event")
      .addChannelOption((option) =>
        option.setName("channel_name").setDescription("channel").setRequired(true)
      )
      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator || PermissionFlagsBits.ModerateMembers
      ),
  
    run: async ({ interaction }) => {
      let store = null;

      const channelname = interaction.options.getChannel("channel_name");
      const channelToMention = channelMention(channelname).slice(2, -1);
      const modalDatafetch = await db
        .collection("events")
        .doc(interaction.guildId)
        .get();
      if (modalDatafetch.exists) {
            if (modalDatafetch.data()[`${channelToMention.slice(2, -1)}`]) {
                store = modalDatafetch.data()[`${channelToMention.slice(2, -1)}`];
                let isdeleted = await modalDatafetch.ref.update({
                    [`${channelToMention.slice(2, -1)}`]: FieldValue.delete(),
                  }).then(() => {
                    delManageEvent({guildId: interaction.guildId, channelId: channelToMention.slice(2, -1)})
                    return true;
                    }).catch((err) => {
                    return false;
                    });

                    if (isdeleted) {
                        return await interaction.reply({
                        content: "Event deleted successfully",
                        ephemeral: true,
                        });
                    } else {
                        return await interaction.reply({
                        content: "Event not deleted",
                        ephemeral: true,
                        });
                    }

            } else {
                store = null;
            }
      } else {
          return await interaction.reply({
              content: "No event to delete. Please create event first using\n `/eventadd --channel_name <channel>`",
              ephemeral: true,
            });
      }
      if (store == undefined || store == null) {
        return await interaction.reply({
          content: "No event from this channel",
          ephemeral: true,
        });
      }
    },
  };

  const delManageEvent = async ({guildId, channelId}) => {
    const docRef = db.collection("manage_channel").doc(guildId);
    const doc = await docRef.get();
    if (doc.exists) {
        let temp = doc.data().storeChannels?.filter((channel) => channel !== channelId);
        await docRef.update({
            storeChannels: temp
        })
    return;
    }
  }
  