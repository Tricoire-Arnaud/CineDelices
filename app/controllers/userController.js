// Contrôleur pour la gestion des utilisateurs
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
  Utensil,
  Like,
} = require("../models");
const bcrypt = require("bcrypt");

const userController = {
  // Récupérer le profil de l'utilisateur connecté
  getProfile: async (req, res) => {
    try {
      // Vérifier si l'utilisateur est connecté
      if (!req.session.user) {
        return res.redirect("/auth/login");
      }

      // Récupérer l'utilisateur avec ses informations complètes
      const user = await User.findByPk(req.session.user.id, {
        attributes: [
          "id_utilisateur",
          "nom_utilisateur",
          "email",
          "role",
          "created_at",
        ],
        include: [
          {
            model: Recipe,
            as: "favoriteRecipes",
            include: [
              {
                model: Movie,
                as: "oeuvre",
                attributes: ["titre"],
              },
              {
                model: Category,
                as: "category",
                attributes: ["libelle"],
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.redirect("/auth/login");
      }

      // Rendre la vue avec les données
      res.render("users/profile", {
        user,
        title: "Mon Profil",
        favoriteRecipes: user.favoriteRecipes || [],
        memberSince: new Date(user.created_at).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    } catch (error) {
      console.error("Erreur profil utilisateur:", error);
      res.status(500).render("errors/500", { user: req.session.user });
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
          email: user.email,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour du profil" });
    }
  },

  // Récupérer les recettes favorites de l'utilisateur
  getFavorites: (req, res) => {
    // Logique pour récupérer les favoris
    res.render("users/favorites");
  },

  // Récupérer l'historique des commentaires de l'utilisateur
  getComments: async (req, res) => {
    try {
      const comments = await Comment.findAll({
        where: { id_utilisateur: req.user.id },
        include: [
          {
            model: Recipe,
            attributes: ["id_recette", "titre", "image"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json(comments);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des commentaires" });
    }
  },

  // Ajouter une recette aux favoris
  addFavorite: async (req, res) => {
    try {
      const { recipeId } = req.params;
      const userId = req.session.user.id;

      // Vérifier si la recette existe
      const recipe = await Recipe.findByPk(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recette non trouvée" });
      }

      // Vérifier si déjà en favori
      const existingFavorite = await Favorite.findOne({
        where: {
          id_recette: recipeId,
          id_utilisateur: userId,
        },
      });

      if (existingFavorite) {
        return res
          .status(400)
          .json({ message: "Cette recette est déjà dans vos favoris" });
      }

      await Favorite.create({
        id_recette: recipeId,
        id_utilisateur: userId,
      });

      res.status(201).json({ message: "Recette ajoutée aux favoris" });
    } catch (error) {
      console.error("Erreur ajout favori:", error);
      res.status(500).json({ message: "Erreur lors de l'ajout aux favoris" });
    }
  },

  // Retirer une recette des favoris
  removeFavorite: async (req, res) => {
    try {
      const { recipeId } = req.params;
      const userId = req.session.user.id;

      const favorite = await Favorite.findOne({
        where: {
          id_recette: recipeId,
          id_utilisateur: userId,
        },
      });

      if (!favorite) {
        return res.status(404).json({ message: "Favori non trouvé" });
      }

      await favorite.destroy();
      res.json({ message: "Recette retirée des favoris" });
    } catch (error) {
      console.error("Erreur suppression favori:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du favori" });
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
        id_utilisateur,
      });

      res.status(201).json(comment);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout du commentaire" });
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
        where: { id_recette: id, id_utilisateur },
      });

      if (existingRating) {
        await existingRating.update({ note });
        res.json({ message: "Note mise à jour" });
      } else {
        await Rating.create({
          note,
          id_recette: id,
          id_utilisateur,
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
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du compte" });
    }
  },

  // voir la page de proposition de recette user
  getProposeRecipe: async (req, res) => {
    try {
      const [categories, movies, ingredients, utensils] = await Promise.all([
        Category.findAll({ order: [["libelle", "ASC"]] }),
        Movie.findAll({ order: [["titre", "ASC"]] }),
        Ingredient.findAll({ order: [["nom_ingredient", "ASC"]] }),
        Utensil.findAll({ order: [["nom_ustensile", "ASC"]] }),
      ]);
      res.render("users/addRecipe", {
        categories,
        movies,
        ingredients,
        utensils
        // messages: {
        //   success: req.flash("success"),
        //   error: req.flash("error"),
        // },
      });
    } catch (error) {
      console.error("Erreur lors du chargement du formulaire:", error);
      req.flash("error", "Erreur lors du chargement du formulaire");
      res.redirect("/mon-profil");
    }
  },


  //proposer une recette (à partir du profil user uniquement)
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

      console.log(req.session.user.id);

      const id_utilisateur = req.session.user.id;

      const recipe = await Recipe.create({
        titre,
        description,
        etapes: JSON.stringify(etapes),
        temps_preparation,
        temps_cuisson,
        difficulte,
        id_oeuvre,
        id_categorie,
        id_utilisateur,
        statut: 'en attente', // Statut par défaut : en attente
        anecdote, // Ajout de l'anecdote
        image // Ajout de l'image
      });

      // Ajouter les ingrédients
      if (ingredients && ingredients.length > 0) {
        // await recipe.addIngredients(ingredients.map(ing => ing.id), {
        //   through: { quantite: ing.quantite }
        // });
        await Promise.all(ingredients.map(async ing => {
          await Recipe.addIngredient(ing.id, { through: { quantite: ing.quantite } });
        }));

      }

      // Ajouter les ustensiles
      if (ustensils && ustensils.length > 0) {
        // await recipe.addUtensils(ustensils);
        await Recipe.addUtensil(ustensils.map(ust => ust.id));

      }
      // res.status(201).json(recipe);

      console.log(typeof Recipe.addIngredient); // Devrait afficher "function"
      console.log(typeof Recipe.addUtensil);    // Devrait afficher "function"

      // Récupérer la recette complète avec ses relations
      const fullRecipe = await Recipe.findByPk(recipe.id_recette, {
        include: [
          { model: Ingredient, through: { attributes: ['quantite'] } },
          { model: Utensil }
        ]
      });

      res.status(201).json(fullRecipe);
    } catch (error) {
      console.error("Erreur lors de la proposition de la recette :", error);
      res.status(500).json({ message: 'Erreur lors de la proposition de la recette' });
    }
  },

};

module.exports = userController;
