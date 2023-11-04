const mongoose = require("mongoose");
const { mongo_Profil } = require("../config.js");

const connection = new mongoose.createConnection(mongo_Profil, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const schema = new mongoose.Schema({
  userID: String,
  nom: String,
  age: Number,
  apparence: String,
  statistiques: {
    force: Number,
    intelligence: Number,
    vitesse: Number,
    points: Number,
  },
  dernierEntraînement: Number,
  monnaie: Number,
  inventaire: [String],
});

const profilSchema = connection.model("Profils", schema);

module.exports = profilSchema;
