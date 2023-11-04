function loadEvents(client) {
  const ascii = require("ascii-table");
  const fs = require("fs");
  const table = new ascii().setHeading("Events", "Status");

  const dossiers = fs.readdirSync("./Events");

  for (const dossier of dossiers) {
    const fichiers = fs
      .readdirSync(`./Events/${dossier}`)
      .filter((fichier) => fichier.endsWith(".js"));

    for (const fichier of fichiers) {
      const fichierEvent = require(`../Events/${dossier}/${fichier}`);

      if (fichierEvent.rest) {
        if (fichierEvent.once) {
          client.rest.once(fichierEvent.name, (...args) =>
            fichierEvent.execute(...args, client)
          );
        } else {
          client.rest.on(fichierEvent.name, (...args) =>
            fichierEvent.execute(...args, client)
          );
        }
      } else {
        if (fichierEvent.once) {
          client.once(fichierEvent.name, (...args) =>
            fichierEvent.execute(...args, client)
          );
        } else {
          client.on(fichierEvent.name, (...args) =>
            fichierEvent.execute(...args, client)
          );
        }
      }

      table.addRow(fichier, "✅");
      continue;
    }
  }

  return console.log("Events Chargés.\n", table.toString());
}

module.exports = { loadEvents };
