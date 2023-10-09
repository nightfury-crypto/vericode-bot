const fs = require('fs');
const { Tatsu } = require("tatsu");

const token = "nA3DJHOb10-i7XqFFVq8hBxAgKTT4PJF0";

const tatsuClient = new Tatsu(token);

let page = 0;
let shouldContinue = true;

let points = [];

async function fetch_demo(guildId, userId) {
  const guild_id = guildId;
  try {
	  let addpoints = tatsuClient.addGuildMemberPoints(guild_id, userId, 1).then((res) => {
		console.log(res);
	  });
	} catch (error) {
		console.log(error);
	}


}

exports.fetch_demo = fetch_demo;
