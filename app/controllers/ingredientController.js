const { Ingredient } = require("../models");

const ingredientController = {
    // Récupérer tous les ingrédients (public)
    getAllIngredients: async (req, res) => {
        try {
            const ingredients = await Ingredient.findAll();
            res.json(ingredients);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des ingrédients" });
        }
    },

    // Récupérer un ingrédient par son ID (public)
    getIngredientById: async (req, res) => {
        try {
            const { id } = req.params;
            const ingredient = await Ingredient.findByPk(id);
            
            if (!ingredient) {
                return res.status(404).json({ message: "Ingrédient non trouvé" });
            }

            res.json(ingredient);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de l'ingrédient" });
        }
    },

    // Créer un nouvel ingrédient (admin)
    createIngredient: async (req, res) => {
        try {
            const { nom, unite } = req.body;
            const ingredient = await Ingredient.create({ nom, unite });
            res.status(201).json(ingredient);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création de l'ingrédient" });
        }
    },

    // Mettre à jour un ingrédient (admin)
    updateIngredient: async (req, res) => {
        try {
            const { id } = req.params;
            const { nom, unite } = req.body;

            const ingredient = await Ingredient.findByPk(id);
            if (!ingredient) {
                return res.status(404).json({ message: "Ingrédient non trouvé" });
            }

            await ingredient.update({ nom, unite });
            res.json({ message: "Ingrédient mis à jour avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour de l'ingrédient" });
        }
    },

    // Supprimer un ingrédient (admin)
    deleteIngredient: async (req, res) => {
        try {
            const { id } = req.params;
            const ingredient = await Ingredient.findByPk(id);

            if (!ingredient) {
                return res.status(404).json({ message: "Ingrédient non trouvé" });
            }

            await ingredient.destroy();
            res.json({ message: "Ingrédient supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de l'ingrédient" });
        }
    }
};

module.exports = ingredientController; 