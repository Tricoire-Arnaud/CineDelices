// Contrôleur pour la gestion des utilisateurs 
const { User, Recipe, Favorite, Comment, Rating, Like } = require("../models");
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

    // Ajouter une recette aux favoris
    addFavorite: async (req, res) => {
        try {
            const { recipeId } = req.params;
            const id_utilisateur = req.user.id;

            // Vérifier si la recette existe
            const recipe = await Recipe.findByPk(recipeId);
            if (!recipe) {
                return res.status(404).json({ message: "Recette non trouvée" });
            }

            // Vérifier si déjà en favori
            const existingFavorite = await Favorite.findOne({
                where: { id_recette: recipeId, id_utilisateur }
            });

            if (existingFavorite) {
                return res.status(400).json({ message: "Cette recette est déjà dans vos favoris" });
            }

            await Favorite.create({ id_recette: recipeId, id_utilisateur });
            res.status(201).json({ message: "Recette ajoutée aux favoris" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de l'ajout aux favoris" });
        }
    },

    // Retirer une recette des favoris
    removeFavorite: async (req, res) => {
        try {
            const { recipeId } = req.params;
            const id_utilisateur = req.user.id;

            const favorite = await Favorite.findOne({
                where: { id_recette: recipeId, id_utilisateur }
            });

            if (!favorite) {
                return res.status(404).json({ message: "Favori non trouvé" });
            }

            await favorite.destroy();
            res.json({ message: "Recette retirée des favoris" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du favori" });
        }
    },

    // Ajouter un commentaire à une recette
    addComment: async (req, res) => {
        try {
            const { id } = req.params;
            const { contenu } = req.body;
            const id_utilisateur = req.user.id;

            // Vérifier si la recette existe
            const recipe = await Recipe.findByPk(id);
            if (!recipe) {
                return res.status(404).json({ message: "Recette non trouvée" });
            }

            const comment = await Comment.create({
                contenu,
                id_recette: id,
                id_utilisateur
            });

            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de l'ajout du commentaire" });
        }
    },

    // Noter une recette
    rateRecipe: async (req, res) => {
        try {
            const { id } = req.params;
            const { note } = req.body;
            const id_utilisateur = req.user.id;

            // Vérifier si la recette existe
            const recipe = await Recipe.findByPk(id);
            if (!recipe) {
                return res.status(404).json({ message: "Recette non trouvée" });
            }

            // Vérifier si l'utilisateur a déjà noté
            const existingRating = await Rating.findOne({
                where: { id_recette: id, id_utilisateur }
            });

            if (existingRating) {
                await existingRating.update({ note });
                res.json({ message: "Note mise à jour" });
            } else {
                await Rating.create({
                    note,
                    id_recette: id,
                    id_utilisateur
                });
                res.status(201).json({ message: "Note ajoutée" });
            }
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la notation" });
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