const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
} = require("discord.js");

const Profil = require("../../DataBase/Profil.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("supprimer-profil")
    .setDescription("Supprimez le profil d'un roleplayer.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName("joueur")
        .setDescription("Le détenteur du profil à supprimer.")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const joueur = interaction.options.getMember("joueur", true);

    if (!interaction.member.roles.cache.has("1139868436223234091")) {
      return interaction.reply({
        content: `:x: vous n'êtes pas un membre du staff !`,
        ephemeral: true,
      });
    }

    Profil.findOne({ userID: joueur.user.id }, async (err, data) => {
      if (err) console.log(err);

      if (!data)
        return interaction.reply({
          content: `:x: la commande a été annulée : ${joueur} n'a pas de profil !`,
          ephemeral: true,
        });

      try {
        Profil.deleteOne({ userID: joueur.user.id }, async (err) => {
          if (err) console.log(err);
        }).then((deletedProfil) => {
          interaction.reply({
            content: `:white_check_mark: le profil de ${joueur} a été supprimé !`,
          });
        });
      } catch (error) {
        return interaction.reply({
          content: `:x: la commande a eu un problème, veuillez réessayer.`,
        });
      }
    });
  },
};
