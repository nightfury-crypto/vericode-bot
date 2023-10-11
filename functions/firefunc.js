const db = require("../constants/firebase-setup");

const getChannelsfromDoc = async ({guildId, channelId, parentId}) => {
    const querySnapshot = await db.collection("manage_channel").doc(guildId).get();
    if (!querySnapshot.exists) {
        return false;
    }
    const data = querySnapshot.data().storeChannels;
    if (data.length > 0) {
      if (data.includes(channelId) || data.includes(parentId)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

module.exports = { getChannelsfromDoc };