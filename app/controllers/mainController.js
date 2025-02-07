const {
  Recipe,
  Movie,
  Category,
  User,
  Ingredient,
  RecipeIngredient,
  Utensil,
  RecipeUtensil,
} = require("../models");
const { Op, literal } = require("sequelize");

const mainController = {
  getHome: async (req, res) => {
    try {
      const [latestRecipes, popularCategories] = await Promise.all([
        // Récupère les 6 dernières recettes avec leurs relations
        Recipe.findAll({
          include: [
            {
              model: Movie,
              as: "oeuvre",
            },
            {
              model: Category,
              as: "category",
            },
          ],
          order: [["created_at", "DESC"]],
          limit: 6,
          raw: false,
        }),

        // Récupère les 4 catégories les plus utilisées
        Category.findAll({
          attributes: [
            "id_categorie",
            "libelle",
            [
              literal(
                '(SELECT COUNT(*) FROM recettes WHERE recettes.id_categorie = "Category".id_categorie)'
              ),
              "recipe_count",
            ],
          ],
          order: [[literal("recipe_count"), "DESC"]],
          limit: 4,
        }),
      ]);

      res.render("home/index", {
        latestRecipes,
        popularCategories,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Erreur page accueil:", error);
      res.status(500).render("errors/500", { user: req.session.user });
    }
  },

  getCatalog: async (req, res) => {
    try {
      let whereClause = {};
      let includeClause = [
        {
          model: Movie,
          as: "oeuvre",
          required: false,
        },
        {
          model: Category,
          as: "category",
          required: false,
        },
      ];

      // Si un filtre de catégorie est sélectionné
      if (req.query.categorie && req.query.categorie !== "all") {
        whereClause.id_categorie = req.query.categorie;
      }

      // Si un filtre de film/série est sélectionné
      if (req.query.oeuvre && req.query.oeuvre !== "all") {
        whereClause.id_oeuvre = req.query.oeuvre;
      }

      // Recherche par titre/description si présente
      const queryRecipes = req.query.queryRecipes || "";
      if (queryRecipes) {
        whereClause[Op.or] = [
          { titre: { [Op.iLike]: `%${queryRecipes}%` } },
          { description: { [Op.iLike]: `%${queryRecipes}%` } },
        ];
      }

      // Récupération de toutes les recettes
      const recipes = await Recipe.findAll({
        where: whereClause,
        include: includeClause,
        order: [["titre", "ASC"]],
        distinct: true,
      });

      // Récupération des catégories et films pour les filtres
      const [categories, movies] = await Promise.all([
        Category.findAll({
          order: [["libelle", "ASC"]],
        }),
        Movie.findAll({
          order: [["titre", "ASC"]],
        }),
      ]);

      // Ajout de la variable noResults
      const noResults = recipes.length === 0 && queryRecipes.trim() !== "";

      res.render("recipes/catalog", {
        recipes,
        categories,
        movies,
        selectedCategory: req.query.categorie || "all",
        selectedMovie: req.query.oeuvre || "all",
        currentQueryRecipes: queryRecipes,
        noResults,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Erreur catalogue:", error);
      res.status(500).render("errors/500", { user: req.session.user });
    }
  },

  search: async (req, res) => {
    try {
      const { q: searchQuery, type } = req.query;
      const results = await searchContent(searchQuery, type);

      res.render("search", {
        results,
        query: searchQuery,
        type,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Erreur recherche:", error);
      res.status(500).render("errors/500");
    }
  },

  // Page Films & Séries

  moviesTvShows: async (req, res) => {
    try {
      const queryFilms = req.query.queryFilms || "";
      let whereClause = {};

      if (queryFilms) {
        whereClause = {
          [Op.or]: [
            { titre: { [Op.iLike]: `%${queryFilms}%` } },
            { description: { [Op.iLike]: `%${queryFilms}%` } },
          ],
        };
      }

      // Récupérer les films et séries séparément
      const [movies, tvShows] = await Promise.all([
        Movie.findAll({
          where: {
            ...whereClause,
            type: "film",
          },
          include: [
            {
              model: Recipe,
              attributes: ["id_recette"], // On récupère juste les IDs pour compter
            },
          ],
          order: [["titre", "ASC"]],
        }),
        Movie.findAll({
          where: {
            ...whereClause,
            type: "série",
          },
          include: [
            {
              model: Recipe,
              attributes: ["id_recette"], // On récupère juste les IDs pour compter
            },
          ],
          order: [["titre", "ASC"]],
        }),
      ]);

      res.render("Movie&Tvshow/movie&Tvshow", {
        movies,
        tvShows,
        currentQueryFilms: queryFilms,
        noResults: queryFilms && movies.length === 0 && tvShows.length === 0,
        user: req.session.user,
      });
    } catch (error) {
      res.status(500).render("errors/500", { user: req.session.user });
    }
  },

  // Nouvelle méthode pour afficher les recettes d'un film/série
  getMovieRecipes: async (req, res) => {
    try {
      const movieId = req.params.id;
      const movie = await Movie.findByPk(movieId, {
        include: [
          {
            model: Recipe,
            include: [{ model: Category, as: "category" }],
          },
        ],
      });

      if (!movie) {
        return res.status(404).render("errors/404", { user: req.session.user });
      }

      res.render("Movie&Tvshow/movieRecipes", {
        movie,
        recipes: movie.Recipes,
        user: req.session.user,
      });
    } catch (error) {
      res.status(500).render("errors/500", { user: req.session.user });
    }
  },

  // Page 404
  notFound: (req, res) => {
    res.status(404).render("errors/404");
  },

  // Page 500
  serverError: (req, res) => {
    res.status(500).render("errors/500");
  },

  //CGU
  getCGU: (req, res) => {
    res.render("legal/CGU");
  },

  //mentions-legales
  getML: (req, res) => {
    res.render("legal/mentions-legales");
  },

  //profil user
  getProfile: (req, res) => {
    res.render("users/profile");
  },

  //listes des recettes coté admin
  getRecipes: (req, res) => {
    res.render("admin/recipes");
  },

  //listes des users coté admin
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["nom_utilisateur", "email", "role"],
      }); // Récupère certaines données
      res.render("admin/users", { users });
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      res.status(500).send("Erreur serveur");
    }
  },

  //tableau de bord coté admin
  getDashboard: async (req, res) => {
    try {
      const usersCount = await User.count();
      const recipesCount = await Recipe.count();
      const moviesSeriesCount = await Movie.count();

      // return { usersCount, recipesCount, moviesSeriesCount };
      res.render("admin/dashboard", {
        usersCount,
        recipesCount,
        moviesSeriesCount,
      });
    } catch (error) {
      console.error("Erreur lors du comptage des documents :", error);
      return { usersCount: 0, recipesCount: 0, moviesSeriesCount: 0 };
    }
  },

  //afficher la page d'ajout d'une oeuvre coté admin
  showaddmoviesTvShows: (req, res) => {
    res.render("admin/addMovie");
  },

  //ajout d'une oeuvre coté admin
  addmoviesTvShows: async (req, res) => {
    try {
      const { titre, type, annee, description } = req.body;
      await Movie.create({ titre, type, annee, description });
      res.redirect("/admin/tableau-de-bord"); // Redirige vers le tableau de bord après l'ajout
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de l'ajout du film ou de la série");
    }
  },

  // Page de connexion
  getLogin: (req, res) => {
    try {
      // Si l'utilisateur est déjà connecté, le rediriger vers la page d'accueil
      if (req.user) {
        return res.redirect("/");
      }
      res.render("auth/login", {
        // error: req.flash('error'),
        // success: req.flash('success'),
        user: req.user,
      });
    } catch (error) {
      console.error("Erreur page connexion:", error);
      res.status(500).render("errors/500");
    }
  },

  // Page d'inscription
  getRegister: (req, res) => {
    try {
      // Si l'utilisateur est déjà connecté, le rediriger vers la page d'accueil
      if (req.user) {
        return res.redirect("/");
      }
      res.render("auth/register", {
        // error: req.flash('error'),
        // success: req.flash('success'),
        user: req.user,
      });
    } catch (error) {
      console.error("Erreur page inscription:", error);
      res.status(500).render("errors/500");
    }
  },

  // Page de détail d'une recette
  getRecipeDetails: async (req, res) => {
    try {
      const recipeId = req.params.id;

      const recipe = await Recipe.findByPk(recipeId, {
        include: [
          {
            model: Movie,
            as: "oeuvre",
            attributes: ["titre", "annee"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["libelle"],
          },
          {
            model: Ingredient,
            through: RecipeIngredient,
            attributes: ["nom_ingredient", "unite_mesure"],
          },
          {
            model: Utensil,
            through: RecipeUtensil,
            attributes: ["nom_ustensile"],
          },
        ],
      });

      if (!recipe) {
        req.flash("error", "Recette non trouvée");
        return res.redirect("/catalogue");
      }

      // Récupérer les recettes similaires (même catégorie)
      const similarRecipes = await Recipe.findAll({
        where: {
          id_categorie: recipe.id_categorie,
          id_recette: { [Op.ne]: recipe.id_recette }, // Exclure la recette actuelle
        },
        include: [
          { model: Movie, as: "oeuvre" },
          { model: Category, as: "category" },
        ],
        limit: 3,
      });

      res.render("recipes/index", {
        recipe,
        similarRecipes,
        title: recipe.titre,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Erreur détails recette:", error);
      res.status(500).render("errors/500", { user: req.session.user });
    }
  },
};

function getSortingOrder(sortType) {
  const sortingOptions = {
    popular: [[literal("rating_avg"), "DESC"]],
    oldest: [["created_at", "ASC"]],
    recent: [["created_at", "DESC"]],
  };

  return sortingOptions[sortType] || sortingOptions.recent;
}

async function searchContent(query, type) {
  if (type === "movies") {
    return Movie.findAll({
      where: {
        titre: { [Op.iLike]: `%${query}%` },
      },
      include: [{ model: Recipe }],
    });
  }

  return Recipe.findAll({
    where: {
      [Op.or]: [
        { titre: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    },
    include: [{ model: Movie }, { model: Category, as: "category" }],
  });
}

module.exports = mainController;
