const express = require('express');
const path = require('node:path');
const app = express();
const sequelize = require('./config/database');
require('dotenv').config();

// Configuration des middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration du moteur de vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// Import des routes
const authRoutes = require('./app/routes/auth');
const recipeRoutes = require('./app/routes/recipe');
const userRoutes = require('./app/routes/user');
const adminRoutes = require('./app/routes/admin');

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

// Port d'écoute
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
async function startServer() {
    try {
        // Synchronisation avec la base de données
        await sequelize.sync();
        console.log('Base de données synchronisée');

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
            console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

startServer(); 