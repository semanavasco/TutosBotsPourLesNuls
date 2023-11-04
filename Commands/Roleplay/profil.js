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
    .setName("profil")
    .setDescription("Contemplez votre profil.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    Profil.findOne({ userID: interaction.user.id }, async (err, data) => {
      if (err) console.log(err);

      if (!data)
        return interaction.reply({
          content: ":x: vous n'avez pas encore de personnage !",
        });

      const embedProfil = new EmbedBuilder()
        .setDescription(
          `# PROFIL DE ${interaction.member} :\n\n**Nom :** \`${data.nom}\`\n**Âge :** \`${data.age}\`\n\n> **Statistiques :**\n**Force :** \`${data.statistiques.force} pts\`\n**Intelligence :** \`${data.statistiques.intelligence} pts\`\n**Vitesse :** \`${data.statistiques.vitesse} pts\`\n**Points à Répartir :** \`${data.statistiques.points}\`\n\n**Apparence :**`
        )
        .setColor("Aqua")
        .setImage(data.apparence);

      return interaction.reply({
        embeds: [embedProfil],
      });
    });
  },
};
