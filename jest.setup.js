require("dotenv").config({ path: ".env.test" });
const { sequelize, initAssociations } = require("./app/models");

// Configuration globale pour les tests
beforeAll(async () => {
  try {
    // Initialiser les associations
    initAssociations();
    console.log("Associations initialisées");

    // Connexion à la base de données
    await sequelize.authenticate();
    console.log("Connexion à la base de données de test établie");

    // Synchroniser tous les modèles
    await sequelize.sync({ force: true });
    console.log("Base de données de test synchronisée");
  } catch (error) {
    console.error("Erreur d'initialisation des tests:", error);
    throw error;
  }
});

// Nettoyage après tous les tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log("Connexion à la base de données fermée");
  } catch (error) {
    console.error("Erreur lors de la fermeture de la connexion:", error);
  }
});

// Réinitialisation de la base entre chaque test
afterEach(async () => {
  try {
    await Promise.all([
      sequelize.query("SET CONSTRAINTS ALL DEFERRED"),
      sequelize.truncate({ cascade: true }),
      sequelize.query("SET CONSTRAINTS ALL IMMEDIATE"),
    ]);
  } catch (error) {
    console.error("Erreur lors du nettoyage de la base de données:", error);
  }
});
