const { IntentsBitField, Client, Collection } = require("discord.js");

const Intents = new IntentsBitField(3276799);
const client = new Client({ intents: Intents });

client.commands = new Collection();
client.config = require("./config.js");

const { loadEvents } = require("./Handlers/loadEvents.js");
const { loadCommands } = require("./Handlers/loadCommands.js");

client
  .login(client.config.token)
  .then(() => {
    loadEvents(client);
    loadCommands(client);
  })
  .catch((error) => console.log(error));
