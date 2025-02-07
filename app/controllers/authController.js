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
      const { email, password } = req.body;
      console.log("=== LOGIN ATTEMPT ===");
      console.log("Email:", email);

      const user = await User.findOne({
        where: { email },
        attributes: [
          "id_utilisateur",
          "nom_utilisateur",
          "email",
          "mot_de_passe",
          "role",
        ],
      });

      console.log("Found user:", user ? user.toJSON() : null);

      if (!user) {
        req.flash("error", "Email ou mot de passe incorrect");
        return res.redirect("/auth/login");
      }

      const validPassword = await bcrypt.compare(password, user.mot_de_passe);

      if (!validPassword) {
        req.flash("error", "Email ou mot de passe incorrect");
        return res.redirect("/auth/login");
      }

      // Stocker les infos utilisateur en session
      req.session.user = {
        id: user.id_utilisateur,
        username: user.nom_utilisateur,
        email: user.email,
        role: user.role,
      };

      console.log("Session user set:", req.session.user);

      // Sauvegarder la session de manière synchrone
      req.session.save((err) => {
        if (err) {
          console.error("Erreur sauvegarde session:", err);
          req.flash("error", "Une erreur est survenue lors de la connexion");
          return res.redirect("/auth/login");
        }

        console.log("Session saved successfully");
        req.flash("success", "Connexion réussie !");
        res.redirect("/");
      });
    } catch (error) {
      console.error("Erreur connexion:", error);
      req.flash("error", "Une erreur est survenue lors de la connexion");
      res.redirect("/auth/login");
    }
  },

  // Déconnexion
  logout: (req, res) => {
    console.log("=== DEBUG LOGOUT START ===");
    console.log("Session before destroy:", req.session);

    req.session.destroy((err) => {
      if (err) {
        console.error("Erreur lors de la déconnexion:", err);
      }
      console.log("Session destroyed");
      console.log("=== DEBUG LOGOUT END ===");
      res.redirect("/");
    });
  },

  // Inscription
  register: async (req, res) => {
    try {
      console.log("=== DEBUG REGISTER START ===");
      console.log("Body:", req.body);

      const { username, email, password } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        req.flash("error", "Cet email est déjà utilisé");
        return res.redirect("/auth/register");
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const user = await User.create({
        nom_utilisateur: username,
        email,
        mot_de_passe: hashedPassword,
        role: "user",
      });

      console.log("User created:", user.toJSON());

      // Connecter l'utilisateur directement après l'inscription
      req.session.user = {
        id: user.id_utilisateur,
        username: user.nom_utilisateur,
        email: user.email,
        role: user.role,
      };

      console.log("Session before save:", req.session);

      // Sauvegarder la session et attendre qu'elle soit sauvegardée
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            reject(err);
          }
          console.log("Session saved successfully");
          resolve();
        });
      });

      console.log("Session after save:", req.session);
      console.log("=== DEBUG REGISTER END ===");

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
