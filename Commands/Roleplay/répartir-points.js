const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

const Profil = require("../../DataBase/Profil.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("répartir-points")
    .setDescription("Répartissez vos statistiques.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addNumberOption((option) =>
      option
        .setName("quantité")
        .setDescription("La quantité de statistiques à répartir.")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const quantité = interaction.options.getNumber("quantité", true);

    Profil.findOne({ userID: interaction.user.id }, async (err, data) => {
      if (err) console.log(err);

      if (!data)
        return interaction.reply({
          content: `:x: la commande a été annulée : vous n'avez pas de profil !`,
          ephemeral: true,
        });

      if (data.statistiques.points < quantité)
        return interaction.reply({
          content: `:x: vous ne possédez pas suffisamment de points ! Points possédés : **${data.statistiques.points}**`,
          ephemeral: true,
        });

      const boutons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("force")
          .setLabel(`Force`)
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("intelligence")
          .setLabel(`Intelligence`)
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("vitesse")
          .setLabel(`Vitesse`)
          .setStyle(ButtonStyle.Primary)
      );

      const réponse = await interaction.reply({
        content: `Dans quelle statistique voulez-vous placer ces **${quantité}** points ?`,
        components: [boutons],
      });

      const filtre = (i) => i.user.id === interaction.user.id;

      try {
        const confirmation = await réponse.awaitMessageComponent({
          filter: filtre,
          time: 60000,
        });

        if (confirmation.customId === "force") {
          data.statistiques.force = data.statistiques.force + quantité;
          data.statistiques.points = data.statistiques.points - quantité;
        } else if (confirmation.customId === "intelligence") {
          data.statistiques.intelligence =
            data.statistiques.intelligence + quantité;
          data.statistiques.points = data.statistiques.points - quantité;
        } else if (confirmation.customId === "vitesse") {
          data.statistiques.vitesse = data.statistiques.vitesse + quantité;
          data.statistiques.points = data.statistiques.points - quantité;
        }

        data.save().catch((err) => {
          if (err) console.log(err);
        });

        return confirmation.update({
          content: `:white_check_mark: vous avez placé **${quantité} points** dans la statistique **${confirmation.customId}** !`,
          components: [],
        });
      } catch (error) {
        interaction.editReply({
          content: `:x: vous n'avez pas répondu dans le temps imparti : 60 secondes.`,
          components: [],
        });
      }
    });
  },
};
