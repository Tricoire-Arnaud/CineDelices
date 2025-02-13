const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const adminController = require("../controllers/adminController");
const ingredientController = require("../controllers/ingredientController");
const utensilController = require("../controllers/utensilController");
const recipeController = require("../controllers/recipeController");
const movieController = require("../controllers/movieController");
const categoryController = require("../controllers/categoryController");

// Protéger toutes les routes admin
router.use(auth.isAuthenticated);
router.use(auth.isAdmin);

// Routes du tableau de bord admin
router.get("/tableau-de-bord", adminController.getDashboard);

// Routes de gestion des utilisateurs
router.get("/utilisateur", adminController.getAllUsers);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Routes de gestion des ingrédients
router.post("/ingredients", ingredientController.createIngredient);
router.put("/ingredients/:id", ingredientController.updateIngredient);
router.delete("/ingredients/:id", ingredientController.deleteIngredient);

// Routes de gestion des ustensiles
router.post("/utensils", utensilController.createUtensil);
router.put("/utensils/:id", utensilController.updateUtensil);
router.delete("/utensils/:id", utensilController.deleteUtensil);

// Routes de gestion des recettes
router.get("/recette", adminController.getRecipes);
router.get("/recette-moderation", adminController.getRecipesToValidate);
router.post("/recettes/valider/:id", adminController.validateRecipes);
router.delete("/recipes/:id", recipeController.deleteRecipe);
router.post("/recipes/:id/delete", recipeController.deleteRecipe);
router.post("/recipes/:id", (req, res) => {
  if (req.query._method === "DELETE") {
    recipeController.deleteRecipe(req, res);
  }
});
router.get("/recettes/ajouter", recipeController.getAddRecipeForm);
router.get("/recettes/modifier/:id", recipeController.getEditRecipeForm);
router.post("/recipes", upload.single("image"), recipeController.createRecipe);
router.put(
  "/recipes/:id",
  upload.single("image"),
  recipeController.updateRecipe
);

// Routes de gestion des films/séries
router.get("/films-series", movieController.getAllMoviesAdmin);
router.get("/films-series/ajouter", movieController.showAddMovieForm);
router.get("/films-series/modifier/:id", movieController.showEditMovieForm);
router.post("/movies", movieController.createMovie);
router.put("/movies/:id", movieController.updateMovie);
router.delete("/movies/:id", movieController.deleteMovie);

// Routes pour la gestion des catégories
router.get("/categories", categoryController.getAllCategories);
router.post("/categories", categoryController.createCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
