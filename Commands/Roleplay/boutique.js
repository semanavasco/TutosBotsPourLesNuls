const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");

const Profil = require("../../DataBase/Profil.js");
const Boutique = require("../../DataBase/Boutique.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("boutique")
    .setDescription("Contemplez la boutique du serveur.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const profilJoueur = await Profil.findOne({ userID: interaction.user.id });

    if (profilJoueur === null)
      return interaction.reply({
        content: ":x: vous n'avez pas encore de personnage !",
      });

    var listeItemsBoutique = "";

    for (const item in Boutique) {
      listeItemsBoutique += `**${Boutique[item].nom} [\`${Boutique[item].prix} $\`]**\n> *${Boutique[item].description}*\n\n`;
    }

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`# BOUTIQUE DU SERVEUR :\n\n${listeItemsBoutique}`);

    interaction.reply({
      embeds: [embed],
    });
  },
};
