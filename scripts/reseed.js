const { Sequelize } = require('sequelize');
require('dotenv').config();

async function reseedDatabase() {
    // Connexion à la base de données existante
    const sequelize = require('../config/database');
    
    try {
        // Authentification à la base de données
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');

        // Import des modèles et de la fonction de synchronisation
        const { syncDatabase } = require('../app/models');
        
        // Synchronisation des tables et réinsertion des données
        await syncDatabase();
        console.log('Données réinsérées avec succès !');
        
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de la réinsertion des données:', error);
        process.exit(1);
    }
}

// Exécution de la réinitialisation des données
console.log('Début de la réinsertion des données...');
reseedDatabase(); 