const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * Modèle Recette
 * Représente une recette de cuisine inspirée d'une œuvre
 */
const Recipe = sequelize.define(
  "Recipe",
  {
    // Identifiant unique de la recette
    id_recette: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Titre de la recette
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Description détaillée de la recette
    description: {
      type: DataTypes.TEXT,
    },
    // Étapes de préparation (stockées en JSON)
    etapes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Temps de préparation en minutes
    temps_preparation: {
      type: DataTypes.INTEGER,
    },
    // Temps de cuisson en minutes
    temps_cuisson: {
      type: DataTypes.INTEGER,
    },
    // Niveau de difficulté (1-5)
    difficulte: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
    // Anecdote liée à l'œuvre
    anecdote: {
      type: DataTypes.TEXT,
    },
    // Chemin de l'image de la recette
    image: {
      type: DataTypes.STRING,
    },
    // Référence à l'œuvre associée
    id_oeuvre: {
      type: DataTypes.INTEGER,
      references: {
        model: "oeuvres",
        key: "id_oeuvre",
      },
    },
    // Référence à la catégorie
    id_categorie: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "id_categorie",
      },
    },
  },
  {
    tableName: "recettes",
  }
);

Recipe.associate = (models) => {
  Recipe.belongsTo(models.Movie, {
    foreignKey: "id_oeuvre",
    as: "oeuvre",
  });

  Recipe.belongsTo(models.Category, {
    foreignKey: "id_categorie",
    as: "category",
  });
};

module.exports = Recipe;
