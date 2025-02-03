const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const bcrypt = require('bcrypt');

/**
 * Modèle Utilisateur
 * Gère les comptes utilisateurs de l'application
 */
const User = sequelize.define('User', {
    // Identifiant unique de l'utilisateur
    id_utilisateur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Nom d'utilisateur unique
    nom_utilisateur: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // Email unique et validé
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    // Mot de passe hashé
    mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Rôle de l'utilisateur (utilisateur ou admin)
    role: {
        type: DataTypes.STRING,
        defaultValue: 'utilisateur'
    }
}, {
    tableName: 'utilisateurs',
    hooks: {
        // Hash le mot de passe avant la création
        beforeCreate: async (user) => {
            if (user.mot_de_passe) {
                user.mot_de_passe = await bcrypt.hash(user.mot_de_passe, 10);
            }
        }
    }
});

module.exports = User; 