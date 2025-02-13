const sequelize = require("../../config/database");

// Import des modèles
const User = require("./User");
const Recipe = require("./Recipe");
const Movie = require("./Movie");
const Category = require("./Category");
const Comment = require("./Comment");
const Rating = require("./Rating");
const Favorite = require("./Favorite");
const Ingredient = require("./Ingredient");
const Utensil = require("./Utensil");
const RecipeIngredient = require("./RecipeIngredient");
const RecipeUtensil = require("./RecipeUtensil");

// Fonction pour initialiser toutes les associations
const initAssociations = () => {
  const models = require("./");

  // Initialiser les associations pour chaque modèle
  for (const model of Object.values(models)) {
    if (model.associate) {
      model.associate(models);
    }
  }
};

/**
 * Synchronise la base de données et peuple les tables
 * force: true => Supprime et recrée toutes les tables
 */
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    const seedDatabase = require("../seeders/seed");
    await seedDatabase();
    console.log("Base de données synchronisée avec succès");
  } catch (error) {
    console.error(
      "Erreur lors de la synchronisation de la base de données:",
      error
    );
  }
};

// Export des modèles et de la fonction de synchronisation
module.exports = {
  sequelize,
  User,
  Recipe,
  Movie,
  Category,
  Comment,
  Rating,
  Favorite,
  Ingredient,
  Utensil,
  RecipeIngredient,
  RecipeUtensil,
  syncDatabase,
  initAssociations,
};
