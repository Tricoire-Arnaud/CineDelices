const { User } = require("../models");
const bcrypt = require("bcrypt");

// Contrôleur pour l'authentification
const authController = {
  // Affichage du formulaire de connexion
  getLogin: (req, res) => {
    res.render("auth/login");
  },

  // Affichage du formulaire d'inscription
  getRegister: (req, res) => {
    res.render("auth/register");
  },

  // Connexion
  login: async (req, res) => {
    try {
      const { email, mot_de_passe } = req.body;
      console.log("Connexion - Email:", email);
      console.log("Connexion - Mot de passe reçu:", mot_de_passe);

      const user = await User.findOne({
        where: { email },
        attributes: [
          "id_utilisateur",
          "nom_utilisateur",
          "email",
          "mot_de_passe",
          "role",
        ],
        raw: true,
      });

      if (!user) {
        console.log("Utilisateur non trouvé");
        req.flash("error", "Email ou mot de passe incorrect");
        return res.redirect("/auth/login");
      }

      console.log("Connexion - Hash stocké:", user.mot_de_passe);
      const validPassword = await bcrypt.compare(
        mot_de_passe,
        user.mot_de_passe
      );
      console.log("Connexion - Résultat bcrypt.compare:", validPassword);

      if (!validPassword) {
        console.log("Mot de passe invalide");
        req.flash("error", "Email ou mot de passe incorrect");
        return res.redirect("/auth/login");
      }

      // Création de la session
      req.session.user = {
        id: user.id_utilisateur,
        username: user.nom_utilisateur,
        email: user.email,
        role: user.role,
      };

      console.log("Session créée:", req.session.user);
      req.flash("success", "Connexion réussie !");
      res.redirect("/");
    } catch (error) {
      console.error("Erreur connexion:", error);
      req.flash("error", "Une erreur est survenue");
      res.redirect("/auth/login");
    }
  },

  // Déconnexion
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) console.error("Erreur déconnexion:", err);
      res.redirect("/");
    });
  },

  // Inscription
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log("Inscription - Mot de passe reçu:", password);

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        req.flash("error", "Cet email est déjà utilisé");
        return res.redirect("/auth/register");
      }

      // Hasher le mot de passe manuellement ici plutôt que d'utiliser le hook
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Inscription - Hash généré:", hashedPassword);

      // Créer l'utilisateur avec le mot de passe déjà hashé
      const user = await User.create({
        nom_utilisateur: username,
        email,
        mot_de_passe: hashedPassword,
        role: "user",
      });

      // Connecter l'utilisateur directement après l'inscription
      req.session.user = {
        id: user.id_utilisateur,
        username: user.nom_utilisateur,
        email: user.email,
        role: user.role,
      };

      req.flash("success", "Inscription réussie !");
      res.redirect("/");
    } catch (error) {
      console.error("Erreur inscription:", error);
      req.flash("error", "Une erreur est survenue lors de l'inscription");
      res.redirect("/auth/register");
    }
  },
};

module.exports = authController;
