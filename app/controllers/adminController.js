// Import des modèles nécessaires depuis le dossier models
const {
  User,
  Recipe,
  Movie,
  Category,
} = require("../models");

const adminController = {
  // Récupère les statistiques générales du site
  getDashboard: async (req, res) => {
    try {
      const stats = {
        users: await User.count(),
        recipes: await Recipe.count(),
        movies: await Movie.count(),
        categories: await Category.count(),
      };
      res.render('admin/dashboard', { stats });
    } catch (error) {
      res.status(500).render('errors/500');
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
      res.render('admin/users', { users });
    } catch (error) {
      res.status(500).render('errors/500');
    }
  },

  // Récupère la liste de toutes les recettes
  getRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.findAll({
        include: [
          { model: Movie },
          { model: Category, as: 'category' }
        ]
      });
      res.render('admin/recipes', { recipes });
    } catch (error) {
      res.status(500).render('errors/500');
    }
  },

  // Affiche la page d'ajout d'une oeuvre
  showaddmoviesTvShows: async (req, res) => {
    try {
      res.render('admin/addMovie');
    } catch (error) {
      res.status(500).render('errors/500');
    }
  },

  // Ajoute une nouvelle oeuvre
  addmoviesTvShows: async (req, res) => {
    try {
      const { titre, type, annee, description } = req.body;
      await Movie.create({ titre, type, annee, description });
      res.redirect('/admin/tableau-de-bord');
    } catch (error) {
      console.error(error);
      res.status(500).render('errors/500');
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
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
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
      res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
  },
};

module.exports = adminController;
