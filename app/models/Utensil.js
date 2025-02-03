const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * Modèle Ustensile
 * Liste tous les ustensiles nécessaires pour les recettes
 */
const Utensil = sequelize.define('Utensil', {
    // Identifiant unique de l'ustensile
    id_ustensile: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Nom de l'ustensile
    nom_ustensile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'ustensiles'
});

module.exports = Utensil;
