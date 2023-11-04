function loadCommands(client) {
  const ascii = require("ascii-table");
  const fs = require("fs");
  const table = new ascii().setHeading("Commandes", "Status");

  var cmdArray = [];

  const dossiers = fs.readdirSync("./Commands");

  for (const dossier of dossiers) {
    const fichiers = fs
      .readdirSync(`./Commands/${dossier}`)
      .filter((fichier) => fichier.endsWith(".js"));

    for (const fichier of fichiers) {
      const fichierCommande = require(`../Commands/${dossier}/${fichier}`);

      client.commands.set(fichierCommande.data.name, fichierCommande);

      cmdArray.push(fichierCommande.data.toJSON());

      table.addRow(fichier, "✅");
      continue;
    }
  }

  client.application.commands.set(cmdArray);

  return console.log("Commandes Chargées.\n", table.toString());
}

module.exports = { loadCommands };
