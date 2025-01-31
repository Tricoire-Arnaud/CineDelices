const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middlewares/auth');

// Routes publiques
router.get('/recettes', recipeController.getAllRecipes);
router.get('/recette/:id', recipeController.getRecipeById);
router.post('/recettes/:movie', recipeController.getRecipesByMovie);
router.get('/recettes/:movie/:id', recipeController.getMovieRecipeById);
router.post('/recettes/:category', recipeController.getRecipesByCategory);
router.post('/recettes/:category/:id', recipeController.getCategoryRecipeById);

// Routes protégées (nécessite authentification)
router.post('/recette', authMiddleware, recipeController.createRecipe);
router.put('/recette/:id', authMiddleware, recipeController.updateRecipe);
router.delete('/recette/:id', authMiddleware, recipeController.deleteRecipe);

module.exports = router; 