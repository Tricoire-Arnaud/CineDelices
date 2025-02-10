const express = require("express");
const path = require("node:path");
const app = express();
const sequelize = require("./config/database");
const { initAssociations } = require("./app/models");
require("dotenv").config();
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const authMiddleware = require("./app/middlewares/auth");
const mainController = require("./app/controllers/mainController");

// Configuration du moteur de vue et du layout
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));
app.set("layout", "layout");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Configuration des middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Configuration de la session
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(flash());

// Middleware pour passer l'utilisateur aux vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Import des routes
const mainRoutes = require("./app/routes/main");
const authRoutes = require("./app/routes/auth");
const adminRoutes = require("./app/routes/admin");
const userRoutes = require("./app/routes/user");
const recipeRoutes = require("./app/routes/recipe"); // Route des recettes

// Routes publiques
app.use("/", mainRoutes); // Page d'accueil
app.use("/catalogue", recipeRoutes); // Utilise les routes de recettes pour le catalogue
app.use("/films-series", mainRoutes); // Utilise les routes principales pour films/séries
app.use("/cgu", mainRoutes); // Utilise les routes principales pour CGU

// Routes protégées
app.use(
  "/recette/:id",
  authMiddleware.isAuthenticated,
  mainController.getRecipeDetails
);
app.use("/mon-profil", authMiddleware.isAuthenticated, userRoutes); // route du profil + ajout de recette
app.use("/admin", authMiddleware.isAdmin, adminRoutes);
app.use("/auth", authRoutes);

// Middleware de gestion des erreurs 404 et 500
app.use((req, res) => {
  res.status(404).render("errors/404");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("errors/500");
});

// Port d'écoute
const PORT = process.env.PORT || 5000;

// Démarrage du serveur
async function startServer() {
  try {
    initAssociations();
    await sequelize.sync();
    console.log("Base de données synchronisée");

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Environnement: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  }
}

startServer();
