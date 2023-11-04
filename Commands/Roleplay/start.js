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
    .setName("start")
    .setDescription("Commencez votre aventure rp en créant votre personnage.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addStringOption((option) =>
      option
        .setName("nom")
        .setDescription("Le nom de votre personnage.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("âge")
        .setDescription("L'âge de votre personnage.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("apparence")
        .setDescription("L'apparence de votre personnage.")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const joueurNom = interaction.options.getString("nom", true);
    const joueurÂge = interaction.options.getNumber("âge", true);
    const joueurApparence = interaction.options.getString("apparence", true);

    if (!interaction.member.roles.cache.has("1137843631219294208"))
      return interaction.reply({
        content:
          ":x: vous n'êtes pas validé ! Demandez au staff de vous valider pour pouvoir créer un profil !",
      });

    Profil.findOne({ userID: interaction.user.id }, async (err, data) => {
      if (err) console.log(err);

      if (data)
        return interaction.reply({
          content: ":x: vous avez déjà un profil !",
        });

      if (
        !joueurApparence.endsWith(".png") &&
        !joueurApparence.endsWith(".jpg") &&
        !joueurApparence.endsWith(".jpeg") &&
        !joueurApparence.endsWith(".webp") &&
        !joueurApparence.endsWith(".gif")
      )
        return interaction.reply({
          content: ":x: l'image spécifiée n'est pas une vraie image !",
        });

      if (
        !joueurApparence.includes("http") &&
        !joueurApparence.includes("https")
      )
        return interaction.reply({
          content: ":x: l'image spécifiée n'est pas une vraie image !",
        });

      const newProfil = new Profil({
        userID: interaction.user.id,
        nom: joueurNom,
        age: joueurÂge,
        apparence: joueurApparence,
        statistiques: {
          force: 5,
          intelligence: 5,
          vitesse: 5,
          points: 0,
        },
        dernierEntraînement: 0,
        monnaie: 10000,
        inventaire: [],
      });

      newProfil.save().catch((err) => {
        if (err) console.log(err);
      });

      const embedProfilCréation = new EmbedBuilder()
        .setTitle("NOUVEAU PERSONNAGE !")
        .setDescription(
          `${interaction.member}, vous venez de créer votre personnage avec les informations suivantes :\n\nNom : **${joueurNom}**\nÂge : **${joueurÂge} ans**\nApparence :`
        )
        .setImage(joueurApparence)
        .setColor("Green");

      return interaction.reply({
        embeds: [embedProfilCréation],
      });
    });
  },
};
