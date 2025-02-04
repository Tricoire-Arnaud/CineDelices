const { Utensil } = require("../models");

const utensilController = {
    // Récupérer tous les ustensiles (public)
    getAllUtensils: async (req, res) => {
        try {
            const utensils = await Utensil.findAll();
            res.json(utensils);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des ustensiles" });
        }
    },

    // Récupérer un ustensile par son ID (public)
    getUtensilById: async (req, res) => {
        try {
            const { id } = req.params;
            const utensil = await Utensil.findByPk(id);
            
            if (!utensil) {
                return res.status(404).json({ message: "Ustensile non trouvé" });
            }

            res.json(utensil);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de l'ustensile" });
        }
    },

    // Créer un nouvel ustensile (admin)
    createUtensil: async (req, res) => {
        try {
            const { nom } = req.body;
            const utensil = await Utensil.create({ nom });
            res.status(201).json(utensil);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création de l'ustensile" });
        }
    },

    // Mettre à jour un ustensile (admin)
    updateUtensil: async (req, res) => {
        try {
            const { id } = req.params;
            const { nom } = req.body;

            const utensil = await Utensil.findByPk(id);
            if (!utensil) {
                return res.status(404).json({ message: "Ustensile non trouvé" });
            }

            await utensil.update({ nom });
            res.json({ message: "Ustensile mis à jour avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour de l'ustensile" });
        }
    },

    // Supprimer un ustensile (admin)
    deleteUtensil: async (req, res) => {
        try {
            const { id } = req.params;
            const utensil = await Utensil.findByPk(id);

            if (!utensil) {
                return res.status(404).json({ message: "Ustensile non trouvé" });
            }

            await utensil.destroy();
            res.json({ message: "Ustensile supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de l'ustensile" });
        }
    }
};

module.exports = utensilController; 