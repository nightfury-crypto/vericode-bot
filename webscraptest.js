const { Tatsu } = require("tatsu");

const token = process.env.TATSU_API_KEY;

const tatsuClient = new Tatsu(token);

async function addTokensTatsu({guildId, userId, points}) {
  const guild_id = guildId;
  try {
	  const adding = await tatsuClient.addGuildMemberPoints(guild_id, userId, parseInt(points)).then((res) => res);
	  if (adding) {
		return true
	  }
	} catch (error) {
		console.log(error);
		return false
	}
}

exports.addTokensTatsu = addTokensTatsu;
