const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const { searchValidation, filterValidation, validate } = require('../middlewares/validators');

// Routes principales
router.get('/', mainController.getHome);
router.get('/catalogue', searchValidation, filterValidation, validate, mainController.getCatalog);
router.get('/films-series', searchValidation, validate, mainController.moviesTvShows);
router.get('/inscription', mainController.getRegister);
router.get('/connexion', mainController.getLogin);
router.get('/recette/:id', mainController.getRecipeDetails);
router.get('/CGU', mainController.getCGU);
router.get('/mentions-legales', mainController.getML);
router.get('/profil', mainController.getProfile);
router.get('/ajout-recette', mainController.addRecipe);

module.exports = router;