const sequelize = require('../../config/database');

// Import des modèles
const User = require('./User');
const Recipe = require('./Recipe');
const Movie = require('./Movie');
const Category = require('./Category');
const Comment = require('./Comment');
const Rating = require('./Rating');
const Favorite = require('./Favorite');
const Ingredient = require('./Ingredient');
const Utensil = require('./Utensil');
const RecipeIngredient = require('./RecipeIngredient');
const RecipeUtensil = require('./RecipeUtensil');

// ============================
//     ASSOCIATIONS USER
// ============================
// Un utilisateur peut avoir plusieurs commentaires
User.hasMany(Comment, { foreignKey: 'id_utilisateur' });
// Un utilisateur peut donner plusieurs notes
User.hasMany(Rating, { foreignKey: 'id_utilisateur' });
// Un utilisateur peut avoir plusieurs recettes favorites
User.hasMany(Favorite, { foreignKey: 'id_utilisateur' });

// ============================
//    ASSOCIATIONS RECIPE
// ============================
// Une recette appartient à une œuvre (film/série)
Recipe.belongsTo(Movie, { foreignKey: 'id_oeuvre' });
// Une recette peut avoir plusieurs commentaires
Recipe.hasMany(Comment, { foreignKey: 'id_recette' });
// Une recette peut avoir plusieurs notes
Recipe.hasMany(Rating, { foreignKey: 'id_recette' });
// Une recette peut être mise en favori plusieurs fois
Recipe.hasMany(Favorite, { foreignKey: 'id_recette' });

// ============================
//  ASSOCIATIONS MANY-TO-MANY
// ============================
// Une recette peut avoir plusieurs ingrédients et un ingrédient peut être dans plusieurs recettes
Recipe.belongsToMany(Ingredient, { 
    through: RecipeIngredient, // Table de liaison
    foreignKey: 'id_recette',
    otherKey: 'id_ingredient'
});
Ingredient.belongsToMany(Recipe, {
    through: RecipeIngredient,
    foreignKey: 'id_ingredient',
    otherKey: 'id_recette'
});

// Une recette peut nécessiter plusieurs ustensiles et un ustensile peut être utilisé dans plusieurs recettes
Recipe.belongsToMany(Utensil, {
    through: RecipeUtensil, // Table de liaison
    foreignKey: 'id_recette',
    otherKey: 'id_ustensile'
});
Utensil.belongsToMany(Recipe, {
    through: RecipeUtensil,
    foreignKey: 'id_ustensile',
    otherKey: 'id_recette'
});

// ============================
//  ASSOCIATIONS INVERSES
// ============================
// Permet d'accéder à l'utilisateur depuis un commentaire
Comment.belongsTo(User, { foreignKey: 'id_utilisateur' });
// Permet d'accéder à la recette depuis un commentaire
Comment.belongsTo(Recipe, { foreignKey: 'id_recette' });

// Permet d'accéder à l'utilisateur depuis une note
Rating.belongsTo(User, { foreignKey: 'id_utilisateur' });
// Permet d'accéder à la recette depuis une note
Rating.belongsTo(Recipe, { foreignKey: 'id_recette' });

// Permet d'accéder à l'utilisateur depuis un favori
Favorite.belongsTo(User, { foreignKey: 'id_utilisateur' });
// Permet d'accéder à la recette depuis un favori
Favorite.belongsTo(Recipe, { foreignKey: 'id_recette' });

/**
 * Synchronise la base de données et peuple les tables
 * force: true => Supprime et recrée toutes les tables
 */
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        const seedDatabase = require('../seeders/seed');
        await seedDatabase();
        console.log('Base de données synchronisée avec succès');
    } catch (error) {
        console.error('Erreur lors de la synchronisation de la base de données:', error);
    }
};

// Initialiser les associations
const initAssociations = () => {
    const models = {
        Category,
        Recipe,
        // Ajouter les autres modèles si nécessaire
    };
    
    // Initialiser les associations
    Object.values(models).forEach(model => {
        if (model.associate) {
            model.associate(models);
        }
    });
};

// Export des modèles et de la fonction de synchronisation
module.exports = {
    sequelize,
    User,
    Recipe,
    Movie,
    Category,
    Comment,
    Rating,
    Favorite,
    Ingredient,
    Utensil,
    RecipeIngredient,
    RecipeUtensil,
    syncDatabase,
    initAssociations
}; 