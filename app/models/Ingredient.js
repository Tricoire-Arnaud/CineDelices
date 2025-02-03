const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * Modèle Ingrédient
 * Liste tous les ingrédients disponibles pour les recettes
 */
const Ingredient = sequelize.define('Ingredient', {
    // Identifiant unique de l'ingrédient
    id_ingredient: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Nom de l'ingrédient
    nom_ingredient: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // Unité de mesure par défaut
    unite_mesure: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'ingredients'
});

module.exports = Ingredient;
