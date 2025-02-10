const { Movie, Recipe } = require("../models");

const movieController = {
  // Récupérer tous les films et séries
  getAllMovies: async (req, res) => {
    try {
      const movies = await Movie.findAll({
        include: [
          {
            model: Recipe,
            attributes: ["id_recette", "titre", "image"],
          },
        ],
      });
      res.json(movies);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des films et séries",
      });
    }
  },

  // Récupérer un film/série spécifique avec ses recettes
  getMovieById: async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id, {
        include: [
          {
            model: Recipe,
            attributes: [
              "id_recette",
              "titre",
              "description",
              "image",
              "temps_preparation",
              "temps_cuisson",
              "difficulte",
            ],
          },
        ],
      });

      if (!movie) {
        return res.status(404).json({ message: "Film/Série non trouvé" });
      }

      res.json(movie);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération du film/série" });
    }
  },

  // Récupérer les films par type (film, série)
  getMoviesByType: async (req, res) => {
    try {
      const { type } = req.params;
      const movies = await Movie.findAll({
        where: { type },
        include: [
          {
            model: Recipe,
            attributes: ["id_recette", "titre", "image"],
          },
        ],
      });
      res.json(movies);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la récupération des films/séries par type",
      });
    }
  },

  // Rechercher des films/séries
  searchMovies: async (req, res) => {
    try {
      const { query } = req.query;
      const movies = await Movie.findAll({
        where: {
          [Op.or]: [
            { titre: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } },
          ],
        },
        include: [
          {
            model: Recipe,
            attributes: ["id_recette", "titre", "image"],
          },
        ],
      });
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche" });
    }
  },

  // Ajouter un nouveau film/série (admin)
  createMovie: async (req, res) => {
    try {
      console.log("Création d'un film/série:", req.body);
      const { titre, type, annee, description } = req.body;
      const movie = await Movie.create({
        titre,
        type,
        annee,
        description,
      });
      req.flash("success", "Film/Série ajouté avec succès");
      res.redirect("/admin/films-series");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      req.flash("error", "Erreur lors de la création du film/série");
      res.redirect("/admin/films-series/ajouter");
    }
  },

  // Mettre à jour un film/série (admin)
  updateMovie: async (req, res) => {
    try {
      console.log("Mise à jour d'un film/série:", req.params.id, req.body);
      const { id } = req.params;
      const { titre, type, annee, description } = req.body;

      const movie = await Movie.findByPk(id);
      if (!movie) {
        console.error("Film/Série non trouvé:", id);
        req.flash("error", "Film/Série non trouvé");
        return res.redirect("/admin/films-series");
      }

      await movie.update({
        titre,
        type,
        annee,
        description,
      });

      req.flash("success", "Film/Série mis à jour avec succès");
      res.redirect("/admin/films-series");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      req.flash("error", "Erreur lors de la mise à jour du film/série");
      res.redirect(`/admin/films-series/modifier/${req.params.id}`);
    }
  },

  // Supprimer un film/série (admin)
  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);

      if (!movie) {
        req.flash("error", "Film/Série non trouvé");
        return res.redirect("/admin/films-series");
      }

      await movie.destroy();
      req.flash("success", "Film/Série supprimé avec succès");
      res.redirect("/admin/films-series");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      req.flash("error", "Erreur lors de la suppression du film/série");
      res.redirect("/admin/films-series");
    }
  },

  // Afficher la liste des films et séries (admin)
  getAllMoviesAdmin: async (req, res) => {
    try {
      const movies = await Movie.findAll({
        include: [
          {
            model: Recipe,
            as: "recipes",
            attributes: ["id_recette"],
          },
        ],
        order: [["titre", "ASC"]],
      });

      res.render("admin/movies", {
        movies,
        title: "Gestion des Films & Séries",
        layout: "layouts/admin",
        path: "/admin/films-series",
        messages: {
          success: req.flash("success"),
          error: req.flash("error"),
        },
      });
    } catch (error) {
      console.error("Erreur lors du chargement des films et séries:", error);
      req.flash("error", "Erreur lors du chargement des films et séries");
      res.redirect("/admin/tableau-de-bord");
    }
  },

  // Afficher le formulaire d'ajout de film/série
  showAddMovieForm: async (req, res) => {
    try {
      res.render("admin/addMovie", {
        title: "Ajouter un Film/Série",
        layout: "layouts/admin",
        path: "/admin/films-series",
        movie: null,
        messages: {
          success: req.flash("success"),
          error: req.flash("error"),
        },
      });
    } catch (error) {
      console.error("Erreur lors du chargement du formulaire:", error);
      req.flash("error", "Erreur lors du chargement du formulaire");
      res.redirect("/admin/films-series");
    }
  },

  // Afficher le formulaire de modification d'un film/série
  showEditMovieForm: async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id, {
        include: [
          {
            model: Recipe,
            as: "recipes",
            attributes: ["id_recette", "titre"],
          },
        ],
      });

      if (!movie) {
        req.flash("error", "Film/Série non trouvé");
        return res.redirect("/admin/films-series");
      }

      res.render("admin/addMovie", {
        title: "Modifier un Film/Série",
        movie,
        layout: "layouts/admin",
        path: "/admin/films-series",
        messages: {
          success: req.flash("success"),
          error: req.flash("error"),
        },
      });
    } catch (error) {
      console.error("Erreur lors du chargement du formulaire:", error);
      req.flash("error", "Erreur lors du chargement du formulaire");
      res.redirect("/admin/films-series");
    }
  },
};

module.exports = movieController;
