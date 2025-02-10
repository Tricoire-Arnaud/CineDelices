// Modèle Commentaire
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * Modèle Commentaire
 * Gère les commentaires des utilisateurs sur les recettes
 */
const Comment = sequelize.define(
  "Comment",
  {
    // Identifiant unique du commentaire
    id_commentaire: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Contenu du commentaire
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Date de création du commentaire
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // Référence à l'utilisateur qui a commenté
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "utilisateurs",
        key: "id_utilisateur",
      },
    },
    // Référence à la recette commentée
    id_recette: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "recettes",
        key: "id_recette",
      },
    },
  },
  {
    tableName: "commentaires",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Comment.associate = (models) => {
  Comment.belongsTo(models.Recipe, {
    foreignKey: "id_recette",
  });

  Comment.belongsTo(models.User, {
    foreignKey: "id_utilisateur",
    as: "author",
  });
};

module.exports = Comment;
