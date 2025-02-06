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
                req.flash('error', 'Email ou mot de passe incorrect');
                return res.redirect('/login');
            }

            // Vérifier le mot de passe
            const validPassword = await bcrypt.compare(password, user.mot_de_passe);
            if (!validPassword) {
                req.flash('error', 'Email ou mot de passe incorrect');
                return res.redirect('/login');
            }

            // Générer le token JWT
            const token = jwt.sign(
                { id: user.id_utilisateur, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Créer la session
            req.session.user = {
                id: user.id_utilisateur,
                username: user.nom_utilisateur,
                email: user.email,
                role: user.role
            };

            req.flash('success', 'Connexion réussie !');
            res.redirect('/');
        } catch (error) {
            console.error('Erreur connexion:', error);
            req.flash('error', 'Une erreur est survenue lors de la connexion');
            res.redirect('/login');
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
                req.flash('error', 'Cet email est déjà utilisé');
                return res.redirect('/register');
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer l'utilisateur
            await User.create({
                nom_utilisateur: username,
                email,
                mot_de_passe: hashedPassword,
                role: 'utilisateur'
            });

            req.flash('success', 'Inscription réussie ! Vous pouvez maintenant vous connecter.');
            res.redirect('/login');
        } catch (error) {
            console.error('Erreur inscription:', error);
            req.flash('error', 'Une erreur est survenue lors de l\'inscription');
            res.redirect('/register');
        }
    }
};

module.exports = authController; 