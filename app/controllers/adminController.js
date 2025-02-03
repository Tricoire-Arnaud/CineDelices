// Import des modèles nécessaires depuis le dossier models
const {
  User,
  Recipe,
  Movie,
  Category,
  Ingredient,
  Utensil,
} = require("../models");

const adminController = {
  // Récupère les statistiques générales du site (nombre d'utilisateurs, recettes, films, etc.)
  getDashboard: async (req, res) => {
    try {
      const stats = {
        users: await User.count(),
        recipes: await Recipe.count(),
        movies: await Movie.count(),
        categories: await Category.count(),
      };
      res.json(stats);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des statistiques" });
    }
  },

  // Récupère la liste de tous les utilisateurs avec leurs informations essentielles
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
      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  },

  // Modifie le rôle d'un utilisateur spécifique
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

  // Supprime un utilisateur de la base de données
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

  // Récupère la liste de tous les ingrédients disponibles
  manageIngredients: async (req, res) => {
    try {
      const ingredients = await Ingredient.findAll();
      res.json(ingredients);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des ingrédients" });
    }
  },

  // Récupère la liste de tous les ustensiles disponibles
  manageUtensils: async (req, res) => {
    try {
      const utensils = await Utensil.findAll();
      res.json(utensils);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des ustensiles" });
    }
  },
};

module.exports = adminController;
