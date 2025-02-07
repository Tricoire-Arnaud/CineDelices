const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

// Profil utilisateur
router.get("/profile", auth.isAuthenticated, userController.getProfile);
router.put("/profile", auth.isAuthenticated, userController.updateProfile);
router.delete("/profile", auth.isAuthenticated, userController.deleteAccount);

// Favoris
router.get("/favorites", auth.isAuthenticated, userController.getFavorites);
router.post(
  "/favorites/:recipeId",
  auth.isAuthenticated,
  userController.addFavorite
);
router.delete(
  "/favorites/:recipeId",
  auth.isAuthenticated,
  userController.removeFavorite
);

// Commentaires
router.get("/comments", auth.isAuthenticated, userController.getComments);
router.post(
  "/recipes/:id/comments",
  auth.isAuthenticated,
  userController.addComment
);

// Notes
router.post(
  "/recipes/:id/ratings",
  auth.isAuthenticated,
  userController.rateRecipe
);

module.exports = router;
