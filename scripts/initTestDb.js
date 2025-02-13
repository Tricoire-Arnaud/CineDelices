require("dotenv").config({ path: ".env.test" });
const { sequelize } = require("../app/models");

async function initTestDb() {
  try {
    // Synchroniser la base de données (cela va créer les tables)
    await sequelize.sync({ force: true });
    console.log("Base de données de test initialisée avec succès.");
    process.exit(0);
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données de test:",
      error
    );
    process.exit(1);
  }
}

initTestDb();
