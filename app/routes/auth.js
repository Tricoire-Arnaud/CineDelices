const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation, validate } = require('../middlewares/validators');

// Routes d'authentification
router.post('/login', loginValidation, validate, authController.login);
router.get('/logout', authController.logout);
router.post('/register', registerValidation, validate, authController.register);

module.exports = router; 