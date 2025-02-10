const {
    Recipe,
    Movie,
    Category,
    Ingredient,
    Utensil,
    Comment,
    Rating,
    Favorite,
    User,
  } = require("../models");
  const { Op } = require("sequelize");
  
  const recipeController = {
    // Récupérer toutes les recettes
    getAllRecipes: async (req, res) => {
      try {
        const recipes = await Recipe.findAll({
          include: [
            { model: Movie, attributes: ["titre"] },
            { model: Category, attributes: ["libelle"] },
          ],
        });
        res.json(recipes);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Erreur lors de la récupération des recettes" });
      }
    },
  
    // Récupérer une recette par son ID
    getRecipeById: async (req, res) => {
      try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id, {
          include: [
            { model: Movie, attributes: ["titre", "type", "annee"] },
            { model: Category, attributes: ["libelle"] },
            { model: Ingredient },
            { model: Utensil },
            {
              model: Comment,
              include: [{ model: User, attributes: ["nom_utilisateur"] }],
            },
            { model: Rating },
          ],
        });
  
        if (!recipe) {
          return res.status(404).json({ message: "Recette non trouvée" });
        }
  
        res.json(recipe);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Erreur lors de la récupération de la recette" });
      }
    },
  
    // Afficher le formulaire d'ajout de recette
    getAddRecipeForm: async (req, res) => {
      try {
        const [categories, movies] = await Promise.all([
          Category.findAll({ order: [["libelle", "ASC"]] }),
          Movie.findAll({ order: [["titre", "ASC"]] }),
        ]);
  
        res.render("admin/addRecipe", {
          categories,
          movies,
          recipe: null,
          title: "Ajouter une recette",
          layout: "layouts/admin",
          path: "/admin/recette",
          messages: {
            success: req.flash("success"),
            error: req.flash("error"),
          },
        });
      } catch (error) {
        console.error("Erreur lors du chargement du formulaire:", error);
        req.flash("error", "Erreur lors du chargement du formulaire");
        res.redirect("/admin/recette");
      }
    },
  
    // Afficher le formulaire de modification
    getEditRecipeForm: async (req, res) => {
      try {
        const { id } = req.params;
        const [recipe, categories, movies] = await Promise.all([
          Recipe.findByPk(id, {
            include: [
              { model: Category, as: "category" },
              { model: Movie, as: "oeuvre" },
              { model: Ingredient },
              { model: Utensil },
            ],
          }),
          Category.findAll({ order: [["libelle", "ASC"]] }),
          Movie.findAll({ order: [["titre", "ASC"]] }),
        ]);
  
        if (!recipe) {
          req.flash("error", "Recette non trouvée");
          return res.redirect("/admin/recette");
        }
  
        res.render("admin/addRecipe", {
          recipe,
          categories,
          movies,
          title: "Modifier la recette",
          layout: "layouts/admin",
          path: "/admin/recette",
          messages: {
            success: req.flash("success"),
            error: req.flash("error"),
          },
        });
      } catch (error) {
        console.error("Erreur lors du chargement de la recette:", error);
        req.flash("error", "Erreur lors du chargement de la recette");
        res.redirect("/admin/recette");
      }
    },
  
    // Créer une nouvelle recette
    createRecipe: async (req, res) => {
      try {
        const {
          titre,
          description,
          temps_preparation,
          temps_cuisson,
          difficulte,
          etapes,
          anecdote,
          id_categorie,
          id_oeuvre,
        } = req.body;
  
        // Gérer l'upload de l'image si présent
        let image = "default-recipe.jpg"; // Image par défaut
        if (req.file) {
          image = req.file.filename;
        }
  
        // Créer la recette
        const recipe = await Recipe.create({
          titre,
          description,
          temps_preparation: parseInt(temps_preparation),
          temps_cuisson: parseInt(temps_cuisson),
          difficulte: parseInt(difficulte),
          etapes: JSON.stringify(etapes),
          anecdote,
          image,
          id_categorie: parseInt(id_categorie),
          id_oeuvre: parseInt(id_oeuvre),
          id_utilisateur: req.user.id,
        });
  
        req.flash("success", "Recette créée avec succès");
        res.redirect("/admin/recette");
      } catch (error) {
        console.error("Erreur lors de la création de la recette:", error);
        req.flash("error", "Erreur lors de la création de la recette");
        res.redirect("/admin/recettes/ajouter");
      }
    },

    // voir la page de proposition de recette user
    getProposeRecipe : (req, res) => {
        res.render('user/addRecipe');
    },

    //proposer une recette (user uniquement)
    proposeRecipe: async (req, res) => {
        try {
          const { 
            titre, 
            description, 
            etapes, 
            temps_preparation, 
            temps_cuisson, 
            difficulte, 
            id_oeuvre, 
            id_categorie,
            ingredients, 
            ustensils,
            anecdote, 
            image 
          } = req.body;
      
          const recipe = await Recipe.create({
            titre,
            description,
            etapes: JSON.stringify(etapes),
            temps_preparation,
            temps_cuisson,
            difficulte,
            id_oeuvre,
            id_categorie,
            statut: 'en attente', // Statut par défaut : en attente
            anecdote, // Ajout de l'anecdote
            image // Ajout de l'image
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
          console.error("Erreur lors de la proposition de la recette :", error);
          res.status(500).json({ message: 'Erreur lors de la proposition de la recette' });
        }
      },
  
    // Mettre à jour une recette
    updateRecipe: async (req, res) => {
      try {
        const { id } = req.params;
        const {
          titre,
          description,
          temps_preparation,
          temps_cuisson,
          difficulte,
          etapes,
          anecdote,
          id_categorie,
          id_oeuvre,
        } = req.body;
  
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
          req.flash("error", "Recette non trouvée");
          return res.redirect("/admin/recette");
        }
  
        // Mettre à jour l'image si une nouvelle est fournie
        let image = recipe.image;
        if (req.file) {
          image = req.file.filename;
        }
  
        // Mettre à jour la recette
        await recipe.update({
          titre,
          description,
          temps_preparation: parseInt(temps_preparation),
          temps_cuisson: parseInt(temps_cuisson),
          difficulte: parseInt(difficulte),
          etapes: JSON.stringify(etapes),
          anecdote,
          image,
          id_categorie: parseInt(id_categorie),
          id_oeuvre: parseInt(id_oeuvre),
        });
  
        req.flash("success", "Recette mise à jour avec succès");
        res.redirect("/admin/recette");
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la recette:", error);
        req.flash("error", "Erreur lors de la mise à jour de la recette");
        res.redirect(`/admin/recettes/modifier/${req.params.id}`);
      }
    },
  
    // Supprimer une recette
    deleteRecipe: async (req, res) => {
      try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id);
  
        if (!recipe) {
          req.flash("error", "Recette non trouvée");
          return res.redirect("/admin/recette");
        }
  
        await recipe.destroy();
        req.flash("success", "Recette supprimée avec succès");
        res.redirect("/admin/recette");
      } catch (error) {
        console.error("Erreur lors de la suppression de la recette:", error);
        req.flash("error", "Erreur lors de la suppression de la recette");
        res.redirect("/admin/recette");
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
          id_utilisateur,
        });
  
        res.status(201).json(comment);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Erreur lors de l'ajout du commentaire" });
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
          id_utilisateur,
        });
  
        res.status(201).json(rating);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Erreur lors de la notation de la recette" });
      }
    },
  
    // Ajouter/Retirer des favoris (utilisateur connecté)
    toggleFavorite: async (req, res) => {
      try {
        const { id_recette } = req.params;
        const id_utilisateur = req.user.id;
  
        const existingFavorite = await Favorite.findOne({
          where: { id_recette, id_utilisateur },
        });
  
        if (existingFavorite) {
          await existingFavorite.destroy();
          res.json({ message: "Recette retirée des favoris" });
        } else {
          await Favorite.create({ id_recette, id_utilisateur });
          res.json({ message: "Recette ajoutée aux favoris" });
        }
      } catch (error) {
        res
          .status(500)
          .json({ message: "Erreur lors de la gestion des favoris" });
      }
    },
  
    // Récupérer les recettes par film
    getRecipesByMovie: async (req, res) => {
      try {
        const { movie } = req.params;
        const recipes = await Recipe.findAll({
          include: [
            {
              model: Movie,
              where: { id_oeuvre: movie },
              attributes: ["titre", "type", "annee"],
            },
          ],
        });
  
        if (!recipes.length) {
          return res
            .status(404)
            .json({ message: "Aucune recette trouvée pour ce film/série" });
        }
  
        res.json(recipes);
      } catch (error) {
        res.status(500).json({
          message: "Erreur lors de la récupération des recettes par film",
        });
      }
    },
  
    // Récupérer une recette spécifique d'un film
    getMovieRecipeById: async (req, res) => {
      try {
        const { movie, id } = req.params;
        const recipe = await Recipe.findOne({
          where: { id_recette: id },
          include: [
            {
              model: Movie,
              where: { id_oeuvre: movie },
              attributes: ["titre", "type", "annee"],
            },
          ],
        });
  
        if (!recipe) {
          return res
            .status(404)
            .json({ message: "Recette non trouvée pour ce film/série" });
        }
  
        res.json(recipe);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Erreur lors de la récupération de la recette" });
      }
    },
  
    // Récupérer les recettes par catégorie
    getRecipesByCategory: async (req, res) => {
      try {
        const { category } = req.params;
        const recipes = await Recipe.findAll({
          include: [
            {
              model: Category,
              where: { id_categorie: category },
              attributes: ["libelle"],
            },
          ],
        });
  
        if (!recipes.length) {
          return res
            .status(404)
            .json({ message: "Aucune recette trouvée pour cette catégorie" });
        }
  
        res.json(recipes);
      } catch (error) {
        res.status(500).json({
          message: "Erreur lors de la récupération des recettes par catégorie",
        });
      }
    },
  
    // Récupérer une recette spécifique d'une catégorie
    getCategoryRecipeById: async (req, res) => {
      try {
        const { category, id } = req.params;
        const recipe = await Recipe.findOne({
          where: { id_recette: id },
          include: [
            {
              model: Category,
              where: { id_categorie: category },
              attributes: ["libelle"],
            },
          ],
        });
  
        if (!recipe) {
          return res
            .status(404)
            .json({ message: "Recette non trouvée pour cette catégorie" });
        }
  
        res.json(recipe);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Erreur lors de la récupération de la recette" });
      }
    },
  };
  
  module.exports = recipeController;