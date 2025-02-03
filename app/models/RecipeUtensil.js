const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * Modèle de liaison Recette-Ustensile
 * Table pivot qui associe les ustensiles nécessaires aux recettes
 */
const RecipeUtensil = sequelize.define('RecipeUtensil', {
    // Référence à la recette
    id_recette: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'recettes',
            key: 'id_recette'
        }
    },
    // Référence à l'ustensile
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