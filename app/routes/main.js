const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const {
  searchValidation,
  filterValidation,
  validate,
} = require("../middlewares/validators");

// Routes principales
router.get("/", mainController.getHome);
router.get(
  "/catalogue",
  searchValidation,
  filterValidation,
  validate,
  mainController.getCatalog
);
router.get("/films-series", mainController.getMoviesAndShows);
router.get("/CGU", mainController.getCGU);
router.get("/mentions-legales", mainController.getML);
router.get("/profil", mainController.getProfile);
router.get("/films-series/:id/recettes", mainController.getMovieRecipes);

// Gestion des erreurs
router.get("/404", mainController.notFound);
router.get("/500", mainController.serverError);

module.exports = router;
