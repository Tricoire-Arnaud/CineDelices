// Modèle Film/Série
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * Modèle Œuvre
 * Représente un film ou une série dont sont inspirées les recettes
 */
const Movie = sequelize.define(
  "Movie",
  {
    // Identifiant unique de l'œuvre
    id_oeuvre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Titre de l'œuvre
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Type d'œuvre (film ou série)
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["film", "série"]],
      },
    },
    // Année de sortie
    annee: {
      type: DataTypes.INTEGER,
    },
    // Synopsis ou description
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "oeuvres",
  }
);

Movie.associate = (models) => {
  Movie.hasMany(models.Recipe, {
    foreignKey: "id_oeuvre",
    as: "recipes",
  });
};

module.exports = Movie;
