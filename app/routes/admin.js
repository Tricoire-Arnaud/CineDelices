const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middlewares/admin');

const adminController = require('../controllers/adminController');
const ingredientController = require('../controllers/ingredientController');
const utensilController = require('../controllers/utensilController');
const recipeController = require('../controllers/recipeController');
const movieController = require('../controllers/movieController');
const categoryController = require('../controllers/categoryController');

// Routes du tableau de bord admin
router.get('/tableau-de-bord', adminMiddleware, adminController.getDashboard);

// Routes de gestion des utilisateurs
router.get('/utilisateur', adminMiddleware, adminController.getAllUsers);
router.put('/users/:id', adminMiddleware, adminController.updateUser);
router.delete('/users/:id', adminMiddleware, adminController.deleteUser);

// Routes de gestion des ingrédients
router.post('/ingredients', adminMiddleware, ingredientController.createIngredient);
router.put('/ingredients/:id', adminMiddleware, ingredientController.updateIngredient);
router.delete('/ingredients/:id', adminMiddleware, ingredientController.deleteIngredient);

// Routes de gestion des ustensiles
router.post('/utensils', adminMiddleware, utensilController.createUtensil);
router.put('/utensils/:id', adminMiddleware, utensilController.updateUtensil);
router.delete('/utensils/:id', adminMiddleware, utensilController.deleteUtensil);

// Routes de gestion des recettes
router.get('/recette', adminMiddleware, adminController.getRecipes);
router.post('/recipes', adminMiddleware, recipeController.createRecipe);
router.put('/recipes/:id', adminMiddleware, recipeController.updateRecipe);
router.delete('/recipes/:id', adminMiddleware, recipeController.deleteRecipe);

// Routes de gestion des films/séries
router.get('/films-series', adminMiddleware, adminController.showaddmoviesTvShows);
router.post('/films-series', adminMiddleware, adminController.addmoviesTvShows);
router.post('/movies', adminMiddleware, movieController.createMovie);
router.put('/movies/:id', adminMiddleware, movieController.updateMovie);
router.delete('/movies/:id', adminMiddleware, movieController.deleteMovie);

// Routes pour la gestion des catégories
router.get('/categories', adminMiddleware, categoryController.getAllCategories);
router.post('/categories', adminMiddleware, categoryController.createCategory);
router.put('/categories/:id', adminMiddleware, categoryController.updateCategory);
router.delete('/categories/:id', adminMiddleware, categoryController.deleteCategory);

module.exports = router; 