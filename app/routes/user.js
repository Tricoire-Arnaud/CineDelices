const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth");

// Routes protégées par authentification
router.use(isAuthenticated);

// Route du profil
router.get("/", userController.getProfile); // La route racine correspondra à /mon-profil

// Gestion des favoris
router.post("/favoris/:recipeId", userController.addFavorite);
router.delete("/favoris/:recipeId", userController.removeFavorite);

// Gestion des commentaires
router.post("/commentaire/:id", userController.addComment);

// Notation des recettes
router.post("/noter/:id", userController.rateRecipe);

// Suppression du compte
router.delete("/supprimer", userController.deleteAccount);

module.exports = router;
