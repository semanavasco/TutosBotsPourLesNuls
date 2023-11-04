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
    .setName("entraînement")
    .setDescription("Améliorez votre personnage.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addStringOption((option) =>
      option
        .setName("statistique")
        .setDescription("La statistique à améliorer.")
        .addChoices(
          { name: "Force", value: "force" },
          { name: "Intelligence", value: "intelligence" },
          { name: "Vitesse", value: "vitesse" }
        )
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const statistique = interaction.options.getString("statistique", true);

    Profil.findOne({ userID: interaction.user.id }, async (err, data) => {
      if (err) console.log(err);

      if (!data)
        return interaction.reply({
          content: ":x: vous n'avez pas encore de personnage !",
        });

      const entraînementActuel = Math.trunc(Date.now() / 1000);

      const différenceEntraînements =
        entraînementActuel - data.dernierEntraînement;

      if (différenceEntraînements < 10800) {
        const tempsRestant =
          10800 - différenceEntraînements + data.dernierEntraînement;

        return interaction.reply({
          content: `:x: vous ne pouvez pas encore effectuer un nouvel entraînement. Vous pourrez refaire un entraînement <t:${tempsRestant}:R>.`,
        });
      }

      if (statistique === "force") {
        data.statistiques.force = data.statistiques.force + 1;
        data.dernierEntraînement = entraînementActuel;
      } else if (statistique === "intelligence") {
        data.statistiques.intelligence = data.statistiques.intelligence + 1;
        data.dernierEntraînement = entraînementActuel;
      } else if (statistique === "vitesse") {
        data.statistiques.vitesse = data.statistiques.vitesse + 1;
        data.dernierEntraînement = entraînementActuel;
      }

      data.save().catch((err) => {
        if (err) console.log(err);
      });

      return interaction.reply({
        content: `:white_check_mark: ${interaction.member}, vous avez effectué un **entraînement** dans la statistique **${statistique}**.`,
      });
    });
  },
};
