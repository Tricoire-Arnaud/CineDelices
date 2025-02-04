const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * Modèle de liaison Recette-Ingrédient
 * Table pivot qui associe les ingrédients aux recettes avec leurs quantités
 */
const RecipeIngredient = sequelize.define('RecipeIngredient', {
    // Référence à la recette
    id_recette: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'recettes',
            key: 'id_recette'
        }
    },
    // Référence à l'ingrédient
    id_ingredient: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'ingredients',
            key: 'id_ingredient'
        }
    },
    // Quantité nécessaire pour la recette
    quantite: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'recette_ingredient'
});

module.exports = RecipeIngredient; 