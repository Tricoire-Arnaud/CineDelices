const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
  validate,
} = require("../middlewares/validators");

// Routes d'authentification
router.get('/login', authController.getLogin);           // Affichage du formulaire de connexion
router.get('/register', authController.getRegister);     // Affichage du formulaire d'inscription
router.post('/login', loginValidation, validate, authController.login);         // Traitement de la connexion
router.post('/register', registerValidation, validate, authController.register); // Traitement de l'inscription
router.get('/logout', authController.logout);            // Déconnexion

module.exports = router;
