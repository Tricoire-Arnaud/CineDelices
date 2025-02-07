const { User } = require("../models");

const authMiddleware = {
  // Middleware pour vérifier si l'utilisateur est connecté
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      // Ajouter l'utilisateur à la requête pour y accéder dans les contrôleurs
      req.user = req.session.user;
      return next();
    }
    req.flash("error", "Vous devez être connecté pour accéder à cette page");
    res.redirect("/auth/login");
  },

  // Middleware pour les pages publiques mais avec accès utilisateur
  addUserToLocals: (req, res, next) => {
    if (req.session && req.session.user) {
      req.user = req.session.user;
    }
    next();
  },

  // Middleware pour vérifier si l'utilisateur est admin
  isAdmin: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === "admin") {
      return next();
    }
    req.flash("error", "Accès non autorisé");
    res.redirect("/");
  },
};

module.exports = authMiddleware;
