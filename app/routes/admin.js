const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middlewares/admin');

const adminController = require('../controllers/adminController');
const ingredientController = require('../controllers/ingredientController');
const utensilController = require('../controllers/utensilController');
const recipeController = require('../controllers/recipeController');
const movieController = require('../controllers/movieController');

// Routes du tableau de bord admin
router.get('/dashboard', adminMiddleware, adminController.getDashboard);

// Routes de gestion des utilisateurs
router.get('/users', adminMiddleware, adminController.getAllUsers);
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
router.post('/recipes', adminMiddleware, recipeController.createRecipe);
router.put('/recipes/:id', adminMiddleware, recipeController.updateRecipe);
router.delete('/recipes/:id', adminMiddleware, recipeController.deleteRecipe);

// Routes de gestion des films/séries
router.post('/movies', adminMiddleware, movieController.createMovie);
router.put('/movies/:id', adminMiddleware, movieController.updateMovie);
router.delete('/movies/:id', adminMiddleware, movieController.deleteMovie);

module.exports = router; 