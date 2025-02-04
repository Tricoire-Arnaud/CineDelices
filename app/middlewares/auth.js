const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token non fourni' });
        }

        const token = authHeader.split(' ')[1];

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Récupérer l'utilisateur
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invalide' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré' });
        }
        res.status(500).json({ message: 'Erreur d\'authentification' });
    }
};

module.exports = authMiddleware;