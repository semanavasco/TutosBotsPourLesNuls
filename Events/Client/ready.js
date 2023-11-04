const { Client, ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    console.log(`Bot connecté sur le client : ${client.user.tag}`);

    client.user.setPresence({
      activities: [
        { type: ActivityType.Watching, name: "Les tutoriels de svasco." },
      ],
      status: "dnd",
    });
  },
};
