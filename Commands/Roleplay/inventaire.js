const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");

const Profil = require("../../DataBase/Profil.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventaire")
    .setDescription("Contemplez votre inventaire.")
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

    var listeItems = "";

    if (profilJoueur.inventaire.length === 0)
      listeItems = "**Vous ne possédez aucun item.**";

    for (const item in profilJoueur.inventaire) {
      listeItems += `**${profilJoueur.inventaire[item]}**, `;
    }

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(
        `# INVENTAIRE DE ${interaction.member} :\n\n> **Monnaie :** \`${profilJoueur.monnaie} $\`\n\n> **Items :** [\`${profilJoueur.inventaire.length}\`]\n\n${listeItems}`
      );

    interaction.reply({
      embeds: [embed],
    });
  },
};
