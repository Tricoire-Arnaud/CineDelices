const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation, validate } = require('../middlewares/validators');
const mainController = require('../controllers/mainController');

// Routes d'authentification
router.get('/login', mainController.getLogin);
router.get('/register', mainController.getRegister);
router.post('/login', loginValidation, validate, authController.login);
router.get('/logout', authController.logout);
router.post('/register', registerValidation, validate, authController.register);

module.exports = router; 