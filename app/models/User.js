const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcrypt");

/**
 * Modèle Utilisateur
 * Gère les comptes utilisateurs de l'application
 */
const User = sequelize.define(
  "User",
  {
    // Identifiant unique de l'utilisateur
    id_utilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Nom d'utilisateur unique
    nom_utilisateur: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Email unique et validé
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Mot de passe hashé
    mot_de_passe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Rôle de l'utilisateur (utilisateur ou admin)
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
  },
  {
    tableName: "utilisateurs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

User.associate = (models) => {
  User.belongsToMany(models.Recipe, {
    through: "user_favorites",
    as: "favoriteRecipes",
    foreignKey: "id_utilisateur",
    otherKey: "id_recette",
    timestamps: true,
  });
};

module.exports = User;
