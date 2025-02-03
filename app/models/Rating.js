const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * Modèle Notation
 * Gère les notes attribuées aux recettes par les utilisateurs
 */
const Rating = sequelize.define('Rating', {
    // Identifiant unique de la notation
    id_notation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Note attribuée (de 1 à 5)
    note: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    // Référence à l'utilisateur qui a noté
    id_utilisateur: {
        type: DataTypes.INTEGER,
        references: {
            model: 'utilisateurs',
            key: 'id_utilisateur'
        }
    },
    // Référence à la recette notée
    id_recette: {
        type: DataTypes.INTEGER,
        references: {
            model: 'recettes',
            key: 'id_recette'
        }
    }
}, {
    tableName: 'notations'
});

module.exports = Rating; 