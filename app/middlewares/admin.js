module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Accès non autorisé. Veuillez vous connecter." });
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Accès refusé. Vous n'avez pas les droits administrateurs." });
    }

    next();
};
