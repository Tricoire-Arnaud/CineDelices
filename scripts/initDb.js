const { Sequelize } = require('sequelize');
require('dotenv').config();

async function initializeDatabase() {
    // Connexion temporaire à postgres pour créer la base de données
    const tempSequelize = new Sequelize('postgres', process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    });

    try {
        // Créer la base de données si elle n'existe pas
        await tempSequelize.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME};`);
        await tempSequelize.query(`CREATE DATABASE ${process.env.DB_NAME};`);
        console.log('Base de données créée avec succès !');
    } catch (error) {
        console.error('Erreur lors de la création de la base de données:', error);
        process.exit(1);
    } finally {
        await tempSequelize.close();
    }

    // Connexion à la nouvelle base de données
    const sequelize = require('../config/database');
    
    try {
        // Authentification à la base de données
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');

        // Import des modèles et de la fonction de synchronisation
        const { syncDatabase } = require('../app/models/');
        
        // Synchronisation des tables et insertion des données
        await syncDatabase();
        console.log('Tables créées et données insérées avec succès !');
        
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de la création des tables ou de l\'insertion des données:', error);
        process.exit(1);
    }
}

// Exécution de l'initialisation
console.log('Début de l\'initialisation de la base de données...');
initializeDatabase(); 