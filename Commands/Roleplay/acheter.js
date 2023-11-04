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
    .setName("acheter")
    .setDescription("Achetez un item.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("L'item que vous voulez acheter.")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const item = interaction.options.getString("item", true);

    const profilJoueur = await Profil.findOne({ userID: interaction.user.id });

    if (profilJoueur === null)
      return interaction.reply({
        content: ":x: vous n'avez pas encore de personnage !",
      });

    if (
      !!Boutique.find((val) => val.nom.toLowerCase() === item.toLowerCase()) ===
      false
    )
      return interaction.reply({
        content: ":x: l'item mentionné n'existe pas !",
      });

    const itemÀAcheter = Boutique.find(
      (val) => val.nom.toLowerCase() === item.toLowerCase()
    );

    if (itemÀAcheter.prix > profilJoueur.monnaie)
      return interaction.reply({
        content: `:x: vous ne pouvez pas acheter cet item. Vous ne possédez pas suffisamment d'argent :\nVotre Solde : **${profilJoueur.monnaie} $**\nPrix de l'Item : **${itemÀAcheter.prix} $**`,
      });

    profilJoueur.monnaie -= itemÀAcheter.prix;

    profilJoueur.inventaire.push(itemÀAcheter.nom);

    profilJoueur.save().catch((err) => {
      if (err) console.log(err);
    });

    interaction.reply({
      content: `:white_check_mark: vous avez acheté l'item **${itemÀAcheter.nom}** pour **${itemÀAcheter.prix}**. (Votre Nouveau Solde : ${profilJoueur.monnaie})`,
    });
  },
};
