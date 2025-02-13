const { Category } = require('../models');

const categoryController = {
    // Récupérer toutes les catégories
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
        }
    },

    // Créer une nouvelle catégorie (admin uniquement)
    createCategory: async (req, res) => {
        try {
            const { libelle } = req.body;
            const category = await Category.create({ libelle });
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la création de la catégorie' });
        }
    },

    // Mettre à jour une catégorie (admin uniquement)
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { libelle } = req.body;

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }

            await category.update({ libelle });
            res.json({ message: 'Catégorie mise à jour avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie' });
        }
    },

    // Supprimer une catégorie (admin uniquement)
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }

            await category.destroy();
            res.json({ message: 'Catégorie supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie' });
        }
    }
};

module.exports = categoryController;