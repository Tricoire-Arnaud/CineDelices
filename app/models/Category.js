// Modèle Catégorie
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * Modèle Catégorie
 * Définit les types de plats (entrée, plat, dessert, etc.)
 */
const Category = sequelize.define(
  "Category",
  {
    // Identifiant unique de la catégorie
    id_categorie: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Nom de la catégorie
    libelle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "categories",
  }
);

Category.associate = function (models) {
  Category.hasMany(models.Recipe, {
    foreignKey: "id_categorie",
    as: "recipes",
  });
};

module.exports = Category;
