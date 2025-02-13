const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Routes protégées par authentification
router.use(isAuthenticated);

// Route du profil
router.get("/", userController.getProfile); // La route racine correspondra à /mon-profil

//ajout recette
router.get("/proposition-recette", isAuthenticated, userController.getProposeRecipe); // La route correspondra à /mon-profil/proposition-recette
router.post("/proposition-recette", isAuthenticated, upload.single("image"), userController.proposeRecipe); // La route  correspondra à /mon-profil/proposition-recette

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
