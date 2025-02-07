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
  // ============================
  //     ASSOCIATIONS USER
  // ============================
  User.hasMany(Comment, { foreignKey: "id_utilisateur" });
  User.hasMany(Rating, { foreignKey: "id_utilisateur" });
  User.hasMany(Favorite, { foreignKey: "id_utilisateur" });

  // ============================
  //    ASSOCIATIONS RECIPE
  // ============================
  Recipe.belongsTo(Movie, { foreignKey: "id_oeuvre", as: "oeuvre" });
  Recipe.belongsTo(Category, { foreignKey: "id_categorie", as: "category" });
  Recipe.hasMany(Comment, { foreignKey: "id_recette" });
  Recipe.hasMany(Rating, { foreignKey: "id_recette" });
  Recipe.hasMany(Favorite, { foreignKey: "id_recette" });

  // ============================
  //  ASSOCIATIONS MANY-TO-MANY
  // ============================
  Recipe.belongsToMany(Ingredient, {
    through: RecipeIngredient,
    foreignKey: "id_recette",
    otherKey: "id_ingredient",
  });
  Ingredient.belongsToMany(Recipe, {
    through: RecipeIngredient,
    foreignKey: "id_ingredient",
    otherKey: "id_recette",
  });

  Recipe.belongsToMany(Utensil, {
    through: RecipeUtensil,
    foreignKey: "id_recette",
    otherKey: "id_ustensile",
  });
  Utensil.belongsToMany(Recipe, {
    through: RecipeUtensil,
    foreignKey: "id_ustensile",
    otherKey: "id_recette",
  });

  // ============================
  //  ASSOCIATIONS INVERSES
  // ============================
  Comment.belongsTo(User, { foreignKey: "id_utilisateur" });
  Comment.belongsTo(Recipe, { foreignKey: "id_recette" });

  Rating.belongsTo(User, { foreignKey: "id_utilisateur" });
  Rating.belongsTo(Recipe, { foreignKey: "id_recette" });

  Favorite.belongsTo(User, { foreignKey: "id_utilisateur" });
  Favorite.belongsTo(Recipe, { foreignKey: "id_recette" });

  Movie.hasMany(Recipe, { foreignKey: "id_oeuvre" });
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
