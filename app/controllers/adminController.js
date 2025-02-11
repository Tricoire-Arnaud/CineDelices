// Import des modèles nécessaires depuis le dossier models
const { User, Recipe, Movie, Category, Comment, Rating } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const adminController = {
  // Récupère les statistiques générales du site
  getDashboard: async (req, res) => {
    try {
      const [usersCount, recipesCount, moviesCount] = await Promise.all([
        User.count(),
        Recipe.count(),
        Movie.count(),
      ]);

      const recentActivities = await adminController._getRecentActivities();
      const chartData = await adminController.getChartData();
      const recipesToValidate = await adminController._RecipesToValidate();

      res.render("admin/dashboard", {
        layout: "layouts/admin",
        usersCount,
        recipesCount,
        moviesCount,
        recentActivities,
        recipesToValidate,
        chartData,
        user: req.user,
        path: "/admin/tableau-de-bord",
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Erreur lors du chargement du tableau de bord:", error);
      res.status(500).render("error/500", {
        layout: "layouts/admin",
        user: req.user,
        path: "/admin/tableau-de-bord",
        messages: req.flash(),
      });
    }
  },

  // Méthode interne pour récupérer les activités récentes
  _getRecentActivities: async () => {
    try {
      const [recentUsers, recentRecipes, recentComments] = await Promise.all([
        User.findAll({
          limit: 5,
          order: [["created_at", "DESC"]],
          attributes: ["nom_utilisateur", "created_at"],
        }),
        Recipe.findAll({
          limit: 5,
          order: [["created_at", "DESC"]],
          attributes: ["titre", "created_at"],
          include: [
            {
              model: User,
              as: "author",
              attributes: ["nom_utilisateur"],
            },
          ],
        }),
        Comment.findAll({
          limit: 5,
          order: [["created_at", "DESC"]],
          include: [
            {
              model: User,
              as: "author",
              attributes: ["nom_utilisateur"],
            },
            {
              model: Recipe,
              attributes: ["titre"],
            },
          ],
        }),
      ]);

      return {
        recentUsers,
        recentRecipes,
        recentComments,
      };
    } catch (error) {
      console.error("Erreur récupération activités récentes:", error);
      return {
        recentUsers: [],
        recentRecipes: [],
        recentComments: [],
      };
    }
  },

  // Récupère la liste de toutes les recettes à valider
  _RecipesToValidate: async (req, res) => {
    try {
      const  recipesToValidate = await Recipe.findAll({
        where: { statut: "en attente" }, // Ajout du filtre pour les recettes en attente
        include: [
          {
            model: Movie,
            as: "oeuvre",
          },
          {
            model: Category,
            as: "category",
          },
          {
            model: User,
            as: "author",
            attributes: ["nom_utilisateur"],
          },
        ],
        order: [["created_at", "DESC"]],
      });
      // console.log("recipesToValidate:", recipesToValidate);
      return { recipesToValidate };
    } catch (error) {
      console.error("Erreur récupération recettes à valider :", error);
      return {
        recipesToValidate: [],
      };
    }
  },

  // Méthode pour récupérer les données des graphiques
  getChartData: async () => {
    try {
      const [userStats, recipeStats, ratingStats] = await Promise.all([
        User.findAll({
          attributes: [
            [
              sequelize.fn("DATE_TRUNC", "month", sequelize.col("created_at")),
              "month",
            ],
            [sequelize.fn("COUNT", "*"), "count"],
          ],
          group: [
            sequelize.fn("DATE_TRUNC", "month", sequelize.col("created_at")),
          ],
          order: [
            [
              sequelize.fn("DATE_TRUNC", "month", sequelize.col("created_at")),
              "ASC",
            ],
          ],
          limit: 12,
        }),
        Recipe.findAll({
          attributes: [
            [
              sequelize.fn("DATE_TRUNC", "month", sequelize.col("created_at")),
              "month",
            ],
            [sequelize.fn("COUNT", "*"), "count"],
          ],
          group: [
            sequelize.fn("DATE_TRUNC", "month", sequelize.col("created_at")),
          ],
          order: [
            [
              sequelize.fn("DATE_TRUNC", "month", sequelize.col("created_at")),
              "ASC",
            ],
          ],
          limit: 12,
        }),
        Rating.findAll({
          attributes: ["note", [sequelize.fn("COUNT", "*"), "count"]],
          group: ["note"],
          order: [["note", "ASC"]],
        }),
      ]);

      return {
        userStats,
        recipeStats,
        ratingStats,
      };
    } catch (error) {
      console.error("Erreur récupération données graphiques:", error);
      return {
        userStats: [],
        recipeStats: [],
        ratingStats: [],
      };
    }
  },

  // Récupère la liste de tous les utilisateurs
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: [
          "id_utilisateur",
          "nom_utilisateur",
          "email",
          "role",
          "created_at",
        ],
      });
      res.render("admin/users", {
        layout: "layouts/admin",
        users,
        user: req.user,
        path: "/admin/utilisateur",
        messages: req.flash(),
      });
    } catch (error) {
      res.status(500).render("errors/500", {
        layout: "layouts/admin",
        user: req.user,
        path: "/admin/utilisateur",
        messages: req.flash(),
      });
    }
  },

  // Récupère la liste de toutes les recettes
  getRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.findAll({
        include: [
          {
            model: Movie,
            as: "oeuvre",
          },
          {
            model: Category,
            as: "category",
          },
          {
            model: User,
            as: "author",
            attributes: ["nom_utilisateur"],
          },
        ],
        order: [["created_at", "DESC"]],
      });
      res.render("admin/recipes", {
        layout: "layouts/admin",
        recipes,
        user: req.user,
        path: "/admin/recette",
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des recettes:", error);
      res.status(500).render("errors/500", {
        layout: "layouts/admin",
        user: req.user,
        path: "/admin/recette",
        messages: req.flash(),
      });
    }
  },

  // Récupère la liste de toutes les recettes à valider
  getRecipesToValidate: async (req, res) => {
    try {
      const recipes = await Recipe.findAll({
        where: { statut: "en attente" }, // Ajout du filtre pour les recettes en attente
        include: [
          {
            model: Movie,
            as: "oeuvre",
          },
          {
            model: Category,
            as: "category",
          },
          {
            model: User,
            as: "author",
            attributes: ["nom_utilisateur"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      console.log(recipes);
      res.render("admin/recipes", {
        layout: "layouts/admin",
        recipes,
        user: req.user,
        path: "/admin/recette-moderation",
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des recettes à valider:", error);
      res.status(500).render("errors/500", {
        layout: "layouts/admin",
        user: req.user,
        path: "/admin/recette-moderation",
        messages: req.flash(),
      });
    }
  },

  // Affiche la page d'ajout d'une oeuvre
  showaddmoviesTvShows: async (req, res) => {
    try {
      res.render("admin/addMovie", {
        layout: "layouts/admin",
        user: req.user,
        path: "/admin/films-series",
        messages: req.flash(),
      });
    } catch (error) {
      res.status(500).render("errors/500", {
        layout: "layouts/admin",
        user: req.user,
        path: "/admin/films-series",
        messages: req.flash(),
      });
    }
  },

  // Ajoute une nouvelle oeuvre
  addmoviesTvShows: async (req, res) => {
    try {
      const { titre, type, annee, description } = req.body;
      await Movie.create({ titre, type, annee, description });
      req.flash("success", "Film/Série ajouté avec succès");
      res.redirect("/admin/tableau-de-bord");
    } catch (error) {
      console.error(error);
      res.status(500).render("errors/500", {
        layout: "layouts/admin",
        user: req.user,
        path: "/admin/films-series",
        messages: req.flash(),
      });
    }
  },

  // Modifie le rôle d'un utilisateur
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      await user.update({ role });
      res.json({ message: "Utilisateur mis à jour avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
    }
  },

  // Supprime un utilisateur
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      await user.destroy();
      res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
  },

  // Récupère la liste de toutes les catégories
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        attributes: [
          "id_categorie",
          "libelle",
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM recettes WHERE recettes.id_categorie = "Category".id_categorie)'
            ),
            "recipeCount",
          ],
        ],
        order: [["libelle", "ASC"]],
      });

      res.render("admin/categories", {
        layout: "layouts/admin",
        categories,
        user: req.user,
        path: "/admin/categories",
        messages: req.flash(),
      });
    } catch (error) {
      res.status(500).render("errors/500", {
        layout: "layouts/admin",
        user: req.user,
        path: "/admin/categories",
        messages: req.flash(),
      });
    }
  },
};

module.exports = adminController;
