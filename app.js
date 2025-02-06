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
const authRoutes = require('./app/routes/auth');
const recipeRoutes = require('./app/routes/recipe');
const userRoutes = require('./app/routes/user');
const adminRoutes = require('./app/routes/admin');

// Routes principales (mainController)
app.get('/', mainController.getHome);
app.get('/catalogue', mainController.getCatalog);
// app.get('/recherche', mainController.search);
app.get('/films-series', mainController.moviesTvShows);
app.get('/inscription', mainController.getRegister);
app.get('/connexion', mainController.getLogin);
app.get('/recette/:id', mainController.getRecipeDetails);
app.get('/CGU', mainController.getCGU);
app.get('/mentions-legales', mainController.getML);

// à faire aujourd'hui :)
app.get('/profil', mainController.getProfile);
app.get('/ajout-recette', mainController.addRecipe);

app.get('/admin/recette', mainController.getRecipes); //attendre Iskander
app.get('/admin/utilisateur', mainController.getUsers);
app.get('/admin/films-series', mainController.getDashboard);
app.get('/admin/tableau-de-bord', mainController.getDashboard); // ok

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/admin', adminRoutes);

// Middleware de gestion des erreurs
app.use((req, res, next) => {
    res.status(404).render('errors/404');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
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