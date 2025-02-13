const {
  User,
  Recipe,
  Movie,
  Category,
  Favorite,
  Comment,
  Rating,
  Ingredient,
  RecipeIngredient,
  RecipeUtensil,
  Utensil,
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
  
    // Afficher le formulaire d'ajout de recette admin
    getAddRecipeForm: async (req, res) => {
      try {
        const [categories, movies, ingredients, utensils] = await Promise.all([
          Category.findAll({ order: [["libelle", "ASC"]] }),
          Movie.findAll({ order: [["titre", "ASC"]] }),
          Ingredient.findAll({ order: [["nom_ingredient", "ASC"]] }),
          Utensil.findAll({ order: [["nom_ustensile", "ASC"]] }),
        ]);
  
        res.render("admin/addRecipe", {
          categories,
          movies,
          ingredients,
          utensils,
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
  
        res.render("admin/modifyRecipe", {
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
        // let image = "default-recipe.jpg"; // Image par défaut
        // if (req.file) {
        //   image = req.file.filename;
        // }
  
        // Créer la recette
        const recipe = await Recipe.create({
          titre,
          description,
          temps_preparation: Number.parseInt(temps_preparation),
          temps_cuisson: Number.parseInt(temps_cuisson),
          difficulte: Number.parseInt(difficulte),
          etapes: JSON.stringify(etapes),
          anecdote,
          image: `uploads/recipes/${req.file.filename}` || null, //objet de l'image via upload (voir le middleware)
          statut: 'validée',
          id_categorie: Number.parseInt(id_categorie),
          id_oeuvre: Number.parseInt(id_oeuvre),
          id_utilisateur: req.user.id,
        });
        // Convertir req.body.ingredients en tableau exploitable (là ce sont des numéros 6,2,8)
        const ingredientsArray = Array.isArray(req.body.ingredients)
        ? req.body.ingredients // Si c'est déjà un tableau
        : req.body.ingredients.split(','); // Convertir une chaîne CSV en tableau

      console.log("Ingrédients après parsing:", ingredientsArray);


      console.log("Recette créée avec l'ID :", recipe.id_recette);

      // Vérifier que la recette crée a bien un ID avant de poursuivre (notamment pour les ingrédients + ustensiles)
      if (!recipe.id_recette) {
        throw new Error("L'ID de la recette est indéfini après la création.");
      }

      //contrôle pour s'assurer que chaque ingrédient a un id valide avant de tenter de l'insérer dans la base de données
      // sinon il ne s'insère pas et ne provoque pas d'erreur
      if (req.body.ingredients && req.body.ingredients.length > 0) {
        const recipeIngredients = req.body.ingredients.map(ingredientId => {
          return {
            id_recette: recipe.id_recette,
            id_ingredient: ingredientId,
            quantite: req.body.quantities?.[ingredientId] || 1  // Récupérer la quantité, sinon 1 par défaut
          };
        });
        await RecipeIngredient.bulkCreate(recipeIngredients);
        console.log("Ingrédients avec quantités ajoutés !");
        } else {
          console.log("Aucun ingrédient valide à ajouter.");
        };

      //contrôle pour s'assurer que chaque ustensile a un id valide avant de tenter de l'insérer dans la base de données
      // sinon il ne s'insère pas et ne provoque pas d'erreur
      if (req.body.utensils && req.body.utensils.length > 0) {
        // Filtrer les ustensiles invalides (ceux sans ID)
        const recipeUtensils = req.body.utensils
          .filter(ut => ut) // Ne garder que les valeurs non nulles
          .map(ut => ({
            id_recette: recipe.id_recette,
            id_ustensile: ut // Assurer que `ut` est un id valide
          }));
      
        if (recipeUtensils.length > 0) {
          await RecipeUtensil.bulkCreate(recipeUtensils); // envoyer les infos sur RecipeUtensil
          console.log("Ustensiles ajoutés !");
        } else {
          console.log("Aucun ustensile valide à ajouter.");
        }
      }  
        req.flash("success", "Recette créée avec succès");
        res.redirect("/admin/recette");
      } catch (error) {
        console.error("Erreur lors de la création de la recette:", error);
        req.flash("error", "Erreur lors de la création de la recette");
        res.redirect("/admin/recettes/ajouter");
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
          temps_preparation: Number.parseInt(temps_preparation),
          temps_cuisson: Number.parseInt(temps_cuisson),
          difficulte: Number.parseInt(difficulte),
          etapes: JSON.stringify(etapes),
          anecdote,
          image,
          id_categorie: Number.parseInt(id_categorie),
          id_oeuvre: Number.parseInt(id_oeuvre),
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