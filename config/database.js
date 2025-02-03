const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

// Test de la connexion
sequelize.authenticate()
    .then(() => console.log('Connexion à la base de données établie avec succès.'))
    .catch(err => console.error('Impossible de se connecter à la base de données:', err));

module.exports = sequelize; 