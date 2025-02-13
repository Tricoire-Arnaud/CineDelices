const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * Modèle de liaison Recette-Ustensile
 * Table pivot qui associe les ustensiles nécessaires aux recettes
 */
const RecipeUtensil = sequelize.define('RecipeUtensil', {
    id_recette: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'recettes',
            key: 'id_recette'
        },
        onDelete: "CASCADE" // Ajout ici
    },
    id_ustensile: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'ustensiles',
            key: 'id_ustensile'
        }
    }
}, {
    tableName: 'recette_ustensile'
});

module.exports = RecipeUtensil;
