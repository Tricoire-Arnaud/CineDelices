const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// Profil utilisateur
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.delete('/profile', authMiddleware, userController.deleteAccount);

// Favoris
router.get('/favorites', authMiddleware, userController.getFavorites);
router.post('/favorites/:recipeId', authMiddleware, userController.addFavorite);
router.delete('/favorites/:recipeId', authMiddleware, userController.removeFavorite);

// Commentaires
router.get('/comments', authMiddleware, userController.getComments);
router.post('/recipes/:id/comments', authMiddleware, userController.addComment);

// Notes
router.post('/recipes/:id/ratings', authMiddleware, userController.rateRecipe);

module.exports = router; 