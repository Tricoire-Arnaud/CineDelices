const { Recipe, Movie, Category, Ingredient, Utensil, Comment, Rating, Favorite, User } = require('../models');
const { Op } = require('sequelize');

const recipeController = {
    // Récupérer toutes les recettes
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

    // Récupérer une recette par son ID
    getRecipeById: async (req, res) => {
        try {
            const { id } = req.params;
            const recipe = await Recipe.findByPk(id, {
                include: [
                    { model: Movie, attributes: ['titre', 'type', 'annee'] },
                    { model: Category, attributes: ['libelle'] },
                    { model: Ingredient },
                    { model: Utensil },
                    { 
                        model: Comment,
                        include: [{ model: User, attributes: ['nom_utilisateur'] }]
                    },
                    { model: Rating }
                ]
            });

            if (!recipe) {
                return res.status(404).json({ message: 'Recette non trouvée' });
            }

            res.json(recipe);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération de la recette' });
        }
    },

    // Créer une nouvelle recette (admin uniquement)
    createRecipe: async (req, res) => {
        try {
            const { 
                titre, description, etapes, temps_preparation, 
                temps_cuisson, difficulte, id_oeuvre, id_categorie,
                ingredients, ustensils 
            } = req.body;

            const recipe = await Recipe.create({
                titre,
                description,
                etapes: JSON.stringify(etapes),
                temps_preparation,
                temps_cuisson,
                difficulte,
                id_oeuvre,
                id_categorie
            });

            // Ajouter les ingrédients
            if (ingredients && ingredients.length > 0) {
                await recipe.addIngredients(ingredients.map(ing => ing.id), {
                    through: { quantite: ing.quantite }
                });
            }

            // Ajouter les ustensiles
            if (ustensils && ustensils.length > 0) {
                await recipe.addUtensils(ustensils);
            }

            res.status(201).json(recipe);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la création de la recette' });
        }
    },

    // Mettre à jour une recette (admin uniquement)
    updateRecipe: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const recipe = await Recipe.findByPk(id);
            if (!recipe) {
                return res.status(404).json({ message: 'Recette non trouvée' });
            }

            await recipe.update(updateData);
            res.json({ message: 'Recette mise à jour avec succès' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour de la recette' });
        }
    },

    // Supprimer une recette (admin uniquement)
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

    // Ajouter un commentaire (utilisateur connecté)
    addComment: async (req, res) => {
        try {
            const { id_recette } = req.params;
            const { contenu } = req.body;
            const id_utilisateur = req.user.id;

            const comment = await Comment.create({
                contenu,
                id_recette,
                id_utilisateur
            });

            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de l\'ajout du commentaire' });
        }
    },

    // Noter une recette (utilisateur connecté)
    rateRecipe: async (req, res) => {
        try {
            const { id_recette } = req.params;
            const { note } = req.body;
            const id_utilisateur = req.user.id;

            const rating = await Rating.create({
                note,
                id_recette,
                id_utilisateur
            });

            res.status(201).json(rating);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la notation de la recette' });
        }
    },

    // Ajouter/Retirer des favoris (utilisateur connecté)
    toggleFavorite: async (req, res) => {
        try {
            const { id_recette } = req.params;
            const id_utilisateur = req.user.id;

            const existingFavorite = await Favorite.findOne({
                where: { id_recette, id_utilisateur }
            });

            if (existingFavorite) {
                await existingFavorite.destroy();
                res.json({ message: 'Recette retirée des favoris' });
            } else {
                await Favorite.create({ id_recette, id_utilisateur });
                res.json({ message: 'Recette ajoutée aux favoris' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la gestion des favoris' });
        }
    },

    // Récupérer les recettes par film
    getRecipesByMovie: async (req, res) => {
        try {
            const { movie } = req.params;
            const recipes = await Recipe.findAll({
                include: [{
                    model: Movie,
                    where: { id_oeuvre: movie },
                    attributes: ['titre', 'type', 'annee']
                }]
            });

            if (!recipes.length) {
                return res.status(404).json({ message: "Aucune recette trouvée pour ce film/série" });
            }

            res.json(recipes);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des recettes par film" });
        }
    },

    // Récupérer une recette spécifique d'un film
    getMovieRecipeById: async (req, res) => {
        try {
            const { movie, id } = req.params;
            const recipe = await Recipe.findOne({
                where: { id_recette: id },
                include: [{
                    model: Movie,
                    where: { id_oeuvre: movie },
                    attributes: ['titre', 'type', 'annee']
                }]
            });

            if (!recipe) {
                return res.status(404).json({ message: "Recette non trouvée pour ce film/série" });
            }

            res.json(recipe);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de la recette" });
        }
    },

    // Récupérer les recettes par catégorie
    getRecipesByCategory: async (req, res) => {
        try {
            const { category } = req.params;
            const recipes = await Recipe.findAll({
                include: [{
                    model: Category,
                    where: { id_categorie: category },
                    attributes: ['libelle']
                }]
            });

            if (!recipes.length) {
                return res.status(404).json({ message: "Aucune recette trouvée pour cette catégorie" });
            }

            res.json(recipes);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des recettes par catégorie" });
        }
    },

    // Récupérer une recette spécifique d'une catégorie
    getCategoryRecipeById: async (req, res) => {
        try {
            const { category, id } = req.params;
            const recipe = await Recipe.findOne({
                where: { id_recette: id },
                include: [{
                    model: Category,
                    where: { id_categorie: category },
                    attributes: ['libelle']
                }]
            });

            if (!recipe) {
                return res.status(404).json({ message: "Recette non trouvée pour cette catégorie" });
            }

            res.json(recipe);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de la recette" });
        }
    }
};

module.exports = recipeController; 