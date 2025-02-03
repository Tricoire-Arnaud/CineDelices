// Contrôleur pour la gestion des fonctionnalités administrateur 
const { User, Recipe, Movie, Category, Ingredient, Utensil } = require('../models');

const adminController = {
    // Tableau de bord admin
    getDashboard: async (req, res) => {
        try {
            const stats = {
                users: await User.count(),
                recipes: await Recipe.count(),
                movies: await Movie.count(),
                categories: await Category.count()
            };
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
        }
    },

    // Gestion des utilisateurs
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: ['id_utilisateur', 'nom_utilisateur', 'email', 'role', 'created_at']
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;
            
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            await user.update({ role });
            res.json({ message: 'Utilisateur mis à jour avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            await user.destroy();
            res.json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
        }
    },

    // Gestion des recettes
    getAllRecipes: async (req, res) => {
        try {
            const recipes = await Recipe.findAll({
                include: [
                    { model: Movie, attributes: ['titre'] },
                    { model: Category, attributes: ['libelle'] }
                ]
            });
            res.json(recipes);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des recettes' });
        }
    },

    validateRecipe: async (req, res) => {
        try {
            const { id } = req.params;
            const recipe = await Recipe.findByPk(id);
            
            if (!recipe) {
                return res.status(404).json({ message: 'Recette non trouvée' });
            }

            await recipe.update({ statut: 'validé' });
            res.json({ message: 'Recette validée avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la validation de la recette' });
        }
    },

    deleteRecipe: async (req, res) => {
        try {
            const { id } = req.params;
            const recipe = await Recipe.findByPk(id);
            
            if (!recipe) {
                return res.status(404).json({ message: 'Recette non trouvée' });
            }

            await recipe.destroy();
            res.json({ message: 'Recette supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression de la recette' });
        }
    },

    // Gestion des ingrédients et ustensiles
    manageIngredients: async (req, res) => {
        try {
            const ingredients = await Ingredient.findAll();
            res.json(ingredients);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des ingrédients' });
        }
    },

    manageUtensils: async (req, res) => {
        try {
            const utensils = await Utensil.findAll();
            res.json(utensils);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des ustensiles' });
        }
    }
};

module.exports = adminController; 