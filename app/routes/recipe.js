const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { isAuthenticated } = require("../middlewares/auth");
const { commentValidation, validate } = require("../middlewares/validators");

// Routes publiques
router.get("/recettes", recipeController.getAllRecipes);
router.get("/recette/:id", recipeController.getRecipeById);
router.get("/recettes/movie/:movie", recipeController.getRecipesByMovie);
router.get("/recettes/movie/:movie/:id", recipeController.getMovieRecipeById);
router.get(
  "/recettes/category/:category",
  recipeController.getRecipesByCategory
);
router.get(
  "/recettes/category/:category/:id",
  recipeController.getCategoryRecipeById
);

// Routes protégées (nécessite authentification)
router.post("/recette", isAuthenticated, recipeController.createRecipe);
router.put("/recette/:id", isAuthenticated, recipeController.updateRecipe);
router.delete("/recette/:id", isAuthenticated, recipeController.deleteRecipe);

router.post(
  "/:id/comment",
  isAuthenticated,
  commentValidation,
  validate,
  recipeController.addComment
);

module.exports = router;
