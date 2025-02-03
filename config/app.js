const express = require('express');
const path = require('node:path');
const app = express();
require('dotenv').config();
const {syncDatabase} = require('../app/models');

// Synchroniser la base de données avant de démarrer le serveur
syncDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Serveur démarré sur le port ${port}`);
    });
});

// Import des routes
const authRoutes = require('../app/routes/auth');
const recipeRoutes = require('../app/routes/recipe');
const userRoutes = require('../app/routes/user');
const adminRoutes = require('../app/routes/admin');

// Configuration des middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Configuration du moteur de vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../app/views'));

// Configuration des routes
app.use('/api/auth', authRoutes);
app.use('/api', recipeRoutes);
app.use('/api', userRoutes);
app.use('/admin', adminRoutes);

// Route racine
app.get('/', (req, res) => {
    res.render('home');
});

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).render('errors/404');
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500');
});

// Configuration de base
const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    uploadDir: process.env.UPLOAD_DIR || 'public/uploads'
};

module.exports = {
    app,
    config
}; 