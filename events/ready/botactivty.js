const { ActivityType } = require("discord.js")

module.exports = ({user}) => {  
    user.setPresence({ activities: [{ name: 'secretly | 24X7', type: ActivityType.Watching}] })
    user.setUsername('VeriCode')
}
