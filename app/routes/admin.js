const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/admin');

// Toutes les routes admin nécessitent le middleware admin
router.use(adminMiddleware);

// Gestion des utilisateurs
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/suspend', adminController.suspendUser);

// Gestion des recettes
router.get('/recettes', adminController.getAllRecipes);
router.post('/recettes', adminController.createRecipe);
router.put('/recettes/:id', adminController.updateRecipe);
router.delete('/recettes/:id', adminController.deleteRecipe);

// Gestion des catégories
router.get('/categories', adminController.getAllCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Gestion des commentaires
router.get('/commentaires', adminController.getAllComments);
router.delete('/commentaires/:id', adminController.deleteComment);

// Gestion des œuvres
router.post('/oeuvres', adminController.createMovie);
router.put('/oeuvres/:id', adminController.updateMovie);
router.delete('/oeuvres/:id', adminController.deleteMovie);

module.exports = router; 