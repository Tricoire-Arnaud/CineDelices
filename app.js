const express = require('express');
const path = require('node:path');
const app = express();
const sequelize = require('./config/database');
const { initAssociations } = require('./app/models');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

// Import des contrôleurs
const mainController = require('./app/controllers/mainController');

// Configuration des middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuration du moteur de vue et du layout
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Configuration de express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// Configuration de la session
const MemoryStore = require('memorystore')(session);
app.use(session({
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 heures
        httpOnly: true
    }
}));

// Configuration de connect-flash
app.use(flash());

// Middleware pour passer l'utilisateur aux vues
app.use((req, res, next) => {
    console.log('=== DEBUG MIDDLEWARE START ===');
    console.log('Session:', req.session);
    console.log('Session ID:', req.sessionID);
    console.log('User in session:', req.session.user);
    
    res.locals.user = req.session.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    
    console.log('User in locals:', res.locals.user);
    console.log('=== DEBUG MIDDLEWARE END ===');
    next();
});

// Servir les fichiers statiques après la configuration de la session
app.use(express.static(path.join(__dirname, 'public')));

// Import des routes
const mainRoutes = require('./app/routes/main');
const authRoutes = require('./app/routes/auth');
const adminRoutes = require('./app/routes/admin');
const userRoutes = require('./app/routes/user');

// Routes API
app.use('/auth', authRoutes);          // Routes d'authentification avec préfixe /auth
app.use('/user', userRoutes);          // Routes utilisateur
app.use('/admin', adminRoutes);        // Routes admin
app.use('/', mainRoutes);              // Routes principales en dernier pour gérer les autres URLs

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