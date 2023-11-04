const { Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const commande = client.commands.get(interaction.commandName);

    if (!commande)
      return interaction.reply({
        content: ":x: cette commande est indisponible pour le moment !",
      });

    commande.execute(interaction, client);
  },
};
