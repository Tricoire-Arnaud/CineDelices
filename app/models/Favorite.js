const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * Modèle Favori
 * Gère les recettes favorites des utilisateurs
 */
const Favorite = sequelize.define('Favorite', {
    // Identifiant unique du favori
    id_favori: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Référence à l'utilisateur qui a mis en favori
    id_utilisateur: {
        type: DataTypes.INTEGER,
        references: {
            model: 'utilisateurs',
            key: 'id_utilisateur'
        }
    },
    // Référence à la recette mise en favori
    id_recette: {
        type: DataTypes.INTEGER,
        references: {
            model: 'recettes',
            key: 'id_recette'
        }
    }
}, {
    tableName: 'favoris'
});

module.exports = Favorite; 