const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// Routes protégées (nécessite authentification)
router.use(authMiddleware);

// Gestion du profil
router.get('/profil', userController.getProfile);
router.put('/user/:id', userController.updateProfile);
router.delete('/user/:id', userController.deleteAccount);

// Gestion des favoris
router.get('/favoris', userController.getFavorites);
router.post('/favoris/:recipeId', userController.addFavorite);
router.delete('/favoris/:recipeId', userController.removeFavorite);

// Gestion des commentaires
router.post('/recette/:id/comment', userController.addComment);
router.post('/recette/:id/note', userController.rateRecipe);

module.exports = router; 