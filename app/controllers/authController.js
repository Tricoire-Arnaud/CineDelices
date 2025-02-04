const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Contrôleur pour l'authentification
const authController = {
    // Connexion
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Vérifier si l'utilisateur existe
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Vérifier le mot de passe
            const validPassword = await bcrypt.compare(password, user.mot_de_passe);
            if (!validPassword) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Générer le token JWT
            const token = jwt.sign(
                { id: user.id_utilisateur, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token, user: {
                id: user.id_utilisateur,
                username: user.nom_utilisateur,
                email: user.email,
                role: user.role
            }});
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la connexion' });
        }
    },

    // Déconnexion
    logout: (req, res) => {
        res.json({ message: 'Déconnexion réussie' });
    },

    // Inscription
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Vérifier si l'email existe déjà
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }

            // Créer le nouvel utilisateur
            const user = await User.create({
                nom_utilisateur: username,
                email,
                mot_de_passe: password, // Le hash est géré par le hook beforeCreate
                role: 'utilisateur'
            });

            res.status(201).json({ 
                message: 'Inscription réussie',
                user: {
                    id: user.id_utilisateur,
                    username: user.nom_utilisateur,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de l\'inscription' });
        }
    }
};

module.exports = authController; 