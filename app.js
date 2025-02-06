const express = require('express');
const path = require('node:path');
const app = express();
const sequelize = require('./config/database');
const { initAssociations } = require('./app/models');
require('dotenv').config();

// Import des contrôleurs
const mainController = require('./app/controllers/mainController');

// Configuration des middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration du moteur de vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// Import des routes
const mainRoutes = require('./app/routes/main');
const authRoutes = require('./app/routes/auth');
const adminRoutes = require('./app/routes/admin');
const userRoutes = require('./app/routes/user');

// Routes API
app.use('/', mainRoutes);          // Routes principales en premier
app.use('/auth', authRoutes);      // Routes d'authentification
app.use('/user', userRoutes);      // Routes utilisateur
app.use('/admin', adminRoutes);    // Routes admin en dernier

// Middleware de gestion des erreurs 404 et 500
app.use((req, res) => {
    res.status(404).render('errors/404');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('errors/500');
});

// Port d'écoute
const PORT = process.env.PORT || 5000;

// Démarrage du serveur
async function startServer() {
    try {
        // Initialiser les associations
        initAssociations();
        
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