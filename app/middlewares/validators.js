const { body, validationResult } = require("express-validator");

const validators = {
  // Validation du formulaire d'inscription
  registerValidation: [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Le nom d'utilisateur doit contenir au moins 3 caractères"),

    body("email").trim().isEmail().withMessage("L'email n'est pas valide"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Le mot de passe doit contenir au moins 8 caractères")
      .matches(/[A-Z]/)
      .withMessage("Le mot de passe doit contenir au moins une majuscule")
      .matches(/[a-z]/)
      .withMessage("Le mot de passe doit contenir au moins une minuscule")
      .matches(/[0-9]/)
      .withMessage("Le mot de passe doit contenir au moins un chiffre")
      .matches(/[@$!%*?&+]/)
      .withMessage(
        "Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&+)"
      ),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Les mots de passe ne correspondent pas");
      }
      return true;
    }),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("error", errors.array()[0].msg);
        return res.redirect("back");
      }
      next();
    },
  ],

  // Validation du formulaire de connexion
  loginValidation: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email invalide")
      .normalizeEmail(),

    body("password").notEmpty().withMessage("Le mot de passe est requis"),
  ],

  // Validation pour la création/modification d'une recette
  recipeValidation: [
    body("titre")
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Le titre doit contenir entre 3 et 100 caractères"),

    body("description")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("La description doit contenir entre 10 et 1000 caractères"),

    body("temps_preparation")
      .isInt({ min: 1, max: 1440 })
      .withMessage("Le temps de préparation doit être entre 1 et 1440 minutes"),

    body("ingredients")
      .isArray()
      .withMessage("La liste des ingrédients est invalide")
      .custom((value) => {
        if (!value.every((ing) => ing.nom && ing.quantite)) {
          throw new Error(
            "Tous les ingrédients doivent avoir un nom et une quantité"
          );
        }
        return true;
      }),

    body("etapes")
      .isArray({ min: 1 })
      .withMessage("Au moins une étape est requise")
      .custom((value) => {
        if (!value.every((step) => step.length >= 10)) {
          throw new Error("Chaque étape doit contenir au moins 10 caractères");
        }
        return true;
      }),

    body("id_categorie").isInt().withMessage("Catégorie invalide"),

    body("id_film").isInt().withMessage("Film/Série invalide"),
  ],

  // Validation de la recherche
  searchValidation: [
    body(["queryFilms", "queryRecipes"])
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("La recherche doit contenir entre 2 et 50 caractères")
      .matches(/^[a-zA-Z0-9\s\-']+$/)
      .withMessage("La recherche contient des caractères non autorisés"),
  ],

  // Validation des filtres et du tri
  filterValidation: [
    body("category")
      .optional()
      .isIn([
        "all",
        "Entrée",
        "Plat principal",
        "Dessert",
        "Boisson",
        "Snack",
        "Apéritif",
      ])
      .withMessage("Catégorie invalide"),

    body("sort")
      .optional()
      .isIn(["recent", "popular", "rating"])
      .withMessage("Option de tri invalide"),

    body("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Numéro de page invalide"),
  ],

  // Validation des commentaires
  commentValidation: [
    body("contenu")
      .trim()
      .isLength({ min: 3, max: 500 })
      .withMessage("Le commentaire doit contenir entre 3 et 500 caractères"),

    body("rating")
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage("La note doit être comprise entre 1 et 5"),
  ],

  // Validation du formulaire de contact
  contactValidation: [
    body("nom")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Le nom doit contenir entre 2 et 50 caractères"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Email invalide")
      .normalizeEmail(),

    body("sujet")
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("Le sujet doit contenir entre 3 et 100 caractères"),

    body("message")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Le message doit contenir entre 10 et 1000 caractères"),
  ],

  // Middleware de validation des résultats
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Pour les recherches, on veut juste nettoyer l'entrée sans bloquer
      if (
        req.path.includes("/search") ||
        req.path.includes("/catalogue") ||
        req.path.includes("/films-series")
      ) {
        // Nettoyer les paramètres de recherche si invalides
        if (req.query.queryFilms) {
          req.query.queryFilms = req.query.queryFilms
            .slice(0, 50)
            .replace(/[^a-zA-Z0-9\s\-']/g, "");
        }
        if (req.query.queryRecipes) {
          req.query.queryRecipes = req.query.queryRecipes
            .slice(0, 50)
            .replace(/[^a-zA-Z0-9\s\-']/g, "");
        }
        return next();
      }

      // Pour les autres formulaires, conserver le comportement existant
      if (req.xhr || req.headers.accept.indexOf("json") > -1) {
        return res.status(400).json({ errors: errors.array() });
      }
      req.flash(
        "error",
        errors.array().map((err) => err.msg)
      );
      return res.redirect("back");
    }
    next();
  },
};

module.exports = validators;
