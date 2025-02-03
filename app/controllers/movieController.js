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
      const { titre, type, annee, description } = req.body;
      const movie = await Movie.create({
        titre,
        type,
        annee,
        description,
      });
      res.status(201).json(movie);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la création du film/série" });
    }
  },

  // Mettre à jour un film/série (admin)
  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const { titre, type, annee, description } = req.body;

      const movie = await Movie.findByPk(id);
      if (!movie) {
        return res.status(404).json({ message: "Film/Série non trouvé" });
      }

      await movie.update({
        titre,
        type,
        annee,
        description,
      });

      res.json({ message: "Film/Série mis à jour avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour du film/série" });
    }
  },

  // Supprimer un film/série (admin)
  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await Movie.findByPk(id);

      if (!movie) {
        return res.status(404).json({ message: "Film/Série non trouvé" });
      }

      await movie.destroy();
      res.json({ message: "Film/Série supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du film/série" });
    }
  },
};

module.exports = movieController;
