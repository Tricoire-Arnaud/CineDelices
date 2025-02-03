// Contrôleur pour la gestion des utilisateurs 
const { User, Recipe, Favorite, Comment, Rating } = require("../models");
const bcrypt = require("bcrypt");

const userController = {
    // Récupérer le profil de l'utilisateur connecté
    getProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['mot_de_passe'] },
                include: [
                    {
                        model: Recipe,
                        as: 'RecettesFavorites',
                        through: { model: Favorite },
                        include: [{ model: Rating }]
                    }
                ]
            });

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du profil" });
        }
    },

    // Mettre à jour le profil de l'utilisateur
    updateProfile: async (req, res) => {
        try {
            const { nom_utilisateur, email, mot_de_passe } = req.body;
            const updateData = {};

            if (nom_utilisateur) updateData.nom_utilisateur = nom_utilisateur;
            if (email) updateData.email = email;
            if (mot_de_passe) {
                updateData.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
            }

            const user = await User.findByPk(req.user.id);
            await user.update(updateData);

            res.json({ 
                message: "Profil mis à jour avec succès",
                user: {
                    id: user.id_utilisateur,
                    nom_utilisateur: user.nom_utilisateur,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
        }
    },

    // Récupérer les recettes favorites de l'utilisateur
    getFavorites: async (req, res) => {
        try {
            const favorites = await Favorite.findAll({
                where: { id_utilisateur: req.user.id },
                include: [{
                    model: Recipe,
                    include: [{ model: Rating }]
                }]
            });

            res.json(favorites);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des favoris" });
        }
    },

    // Récupérer l'historique des commentaires de l'utilisateur
    getComments: async (req, res) => {
        try {
            const comments = await Comment.findAll({
                where: { id_utilisateur: req.user.id },
                include: [{
                    model: Recipe,
                    attributes: ['id_recette', 'titre', 'image']
                }],
                order: [['created_at', 'DESC']]
            });

            res.json(comments);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des commentaires" });
        }
    },


    // Supprimer son compte
    deleteAccount: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id);
            await user.destroy();
            res.json({ message: "Compte supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du compte" });
        }
    }
};

module.exports = userController; 