const { Recipe, Movie, Category, User, Ingredient, Utensil } = require('../models');
const { Op, literal } = require('sequelize');


const mainController = {
    getHome: async (req, res) => {
        try {
            const [latestRecipes, popularCategories] = await Promise.all([
                // Récupère les 6 dernières recettes avec leurs relations
                Recipe.findAll({
                    include: [
                        { model: Movie },
                        { model: Category, as: 'category' }
                    ],
                    order: [['created_at', 'DESC']],
                    limit: 6
                }),

                // Récupère les 4 catégories les plus utilisées
                Category.findAll({
                    attributes: [
                        'id_categorie',
                        'libelle',
                        [
                            literal('(SELECT COUNT(*) FROM recettes WHERE recettes.id_categorie = "Category".id_categorie)'),
                            'recipe_count'
                        ]
                    ],
                    order: [[literal('(SELECT COUNT(*) FROM recettes WHERE recettes.id_categorie = "Category".id_categorie)'), 'DESC']],
                    limit: 4
                })
            ]);

            res.render('home/index', {
                latestRecipes,
                popularCategories,
                user: req.user
            });
        } catch (error) {
            console.error('Erreur page accueil:', error);
            res.status(500).render('errors/500');
        }
    },

    getCatalog: async (req, res) => {
        try {
            const {
                page = 1,
                category,
                sort = 'recent',
            } = req.query;

            const queryRecipes = Array.isArray(req.query.queryRecipes) ? req.query.queryRecipes[0] : req.query.queryRecipes || '';


            const limit = 12;
            const offset = (page - 1) * limit;
            const whereClause = category ? { id_categorie: category } : {};

            // Condition de recherche pour les recettes
            const searchConditionRecipes = queryRecipes ? { titre: { [Op.iLike]: `%${queryRecipes}%` } } : {};

            let recipes = [];
            let categories = [];

            console.log(queryRecipes);

            if (!queryRecipes) {
                // Si aucune recherche n'est faite, récupérer les recettes avec pagination
                [recipes, categories] = await Promise.all([
                    Recipe.findAndCountAll({
                        where: whereClause,
                        include: [
                            { model: Movie },
                            { model: Category, as: 'category' }
                        ],
                        order: getSortingOrder(sort),
                        limit,
                        offset
                    }),
                    Category.findAll()
                ]);
            } else {
                // Si une recherche est effectuée, récupérer les recettes filtrées par titre
                [recipes, categories] = await Promise.all([
                    Recipe.findAndCountAll({
                        where: {
                            ...whereClause,
                            ...searchConditionRecipes
                        },
                        include: [
                            { model: Movie },
                            { model: Category, as: 'category' }
                        ],
                        order: getSortingOrder(sort),
                        limit,
                        offset
                    }),
                    Category.findAll()
                ]);
            }

            // Vérifier s'il y a des résultats
            const noResults = queryRecipes && recipes.count === 0;

            res.render('recipes/catalog', {
                recipes: recipes.rows,
                categories,
                currentPage: Number.parseInt(page),
                totalPages: Math.ceil(recipes.count / limit),
                currentCategory: category,
                currentSort: sort,
                currentQueryRecipes: queryRecipes,
                noResults, // Permettra d'afficher "Aucun résultat" dans la vue
                user: req.user
            });

        } catch (error) {
            console.error('Erreur catalogue:', error);
            res.status(500).render('errors/500');
        }
    },


    search: async (req, res) => {
        try {
            const { q: searchQuery, type } = req.query;
            const results = await searchContent(searchQuery, type);

            res.render('search', {
                results,
                query: searchQuery,
                type,
                user: req.user
            });
        } catch (error) {
            console.error('Erreur recherche:', error);
            res.status(500).render('errors/500');
        }
    },



    // Page Films & Séries

    moviesTvShows: async (req, res) => {
        try {
            const { type = 'films-series' } = req.query;
            const queryFilms = Array.isArray(req.query.queryFilms) ? req.query.queryFilms[0] : req.query.queryFilms || '';


            // Vérifier si le type est correct, sinon rediriger
            if (queryFilms && type !== 'films-series') {
                return res.redirect(`/films-series?queryFilms=${queryFilms}&type=films-series`);
            }

            // Condition de recherche pour les films/séries
            const searchConditionFilms = queryFilms ? { titre: { [Op.iLike]: `%${queryFilms}%` } } : {};

            // Initialiser les variables pour éviter les erreurs
            let movies = [];
            let movieRecipes = [];
            let tvShowRecipes = [];

            if (!queryFilms) {
                // Si pas de recherche, récupérer les listes de films et séries avec leurs recettes
                movieRecipes = await Recipe.findAll({
                    include: [
                        {
                            model: Movie,
                            where: { type: 'film' } // Filtrer sur les films
                        },
                        { model: Category, as: 'category' }
                    ],
                    order: [['created_at', 'DESC']],
                    limit: 6
                });

                tvShowRecipes = await Recipe.findAll({
                    include: [
                        {
                            model: Movie,
                            where: { type: 'série' } // Filtrer sur les séries
                        },
                        { model: Category, as: 'category' }
                    ],
                    order: [['created_at', 'DESC']],
                    limit: 6
                });
            } else {
                // Si recherche, récupérer les films et séries correspondants
                console.log("Query films:", queryFilms); // Ajoute cette ligne pour vérifier
                movies = await Movie.findAll({
                    where: {
                        ...searchConditionFilms,
                        type: { [Op.in]: ['film', 'série'] }
                    },
                    include: [{
                        model: Recipe,
                        foreignKey: 'id_oeuvre'
                    }] // Associer les recettes liées
                });
                console.log(movies); // Vérifie si les recettes sont bien incluses dans les films/séries

            }

            // Vérifier s'il y a des résultats
            const noResults = queryFilms && movies.length === 0;

            res.render('Movie&Tvshow/movie&Tvshow', {
                movieRecipes,
                tvShowRecipes,
                movies, // Résultats de la recherche
                currentQueryFilms: queryFilms,
                currentType: 'films-series',
                noResults, // Permettra d'afficher "Aucun résultat" dans la vue
                user: req.user
            });

        } catch (error) {
            console.error(error);
            res.status(500).render('errors/500');
        }
    },


    // moviesTvShows: async (req, res) => {
    //     try {
    //         // Récupérer les recettes récentes pour les films
    //         const movieRecipes = await Recipe.findAll({
    //             include: [
    //                 {
    //                     model: Movie,
    //                     where: { type: 'film' } // Filtrer sur les films
    //                 },
    //                 { model: Category, as: 'category' }
    //             ],
    //             order: [['created_at', 'DESC']],
    //             limit: 6
    //         });

    //         // Récupérer les recettes récentes pour les series
    //         const tvShowRecipes = await Recipe.findAll({
    //             include: [
    //                 {
    //                     model: Movie,
    //                     where: { type: 'série' } // Filtrer sur les séries
    //                 },
    //                 { model: Category, as: 'category' }
    //             ],
    //             order: [['created_at', 'DESC']],
    //             limit: 6
    //         });

    //         res.render('Movie&Tvshow/movie&Tvshow', {
    //             movieRecipes,
    //             tvShowRecipes,
    //             user: req.user
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).render('errors/500');
    //     }
    // },

    // Page 404
    notFound: (req, res) => {
        res.status(404).render('errors/404');
    },

    // Page 500
    serverError: (req, res) => {
        res.status(500).render('errors/500');
    },

    //CGU
    getCGU: (req, res) => {
        res.render('legal/CGU');
    },

    //mentions-legales
    getML: (req, res) => {
        res.render('legal/mentions-legales');
    },

    //profil user
    getProfile: (req, res) => {
        res.render('users/profile');
    },

    //listes des recettes coté admin
    getRecipes: (req, res) => {
        res.render('admin/recipes');
    },


    //listes des users coté admin
    getUsers: async (req, res) => {
        try {
            const users = await User.findAll({ attributes: ['nom_utilisateur', 'email', 'role'] }); // Récupère certaines données
            res.render('admin/users', { users });
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
            res.render('admin/dashboard', { usersCount, recipesCount, moviesSeriesCount });

        } catch (error) {
            console.error('Erreur lors du comptage des documents :', error);
            return { usersCount: 0, recipesCount: 0, moviesSeriesCount: 0 };
        }
    },

    //afficher la page d'ajout d'une oeuvre coté admin
    showaddmoviesTvShows: (req, res) => {
        res.render('admin/addMovie');
    },

    //ajout d'une oeuvre coté admin
    addmoviesTvShows: async (req, res) => {
        try {
            const { titre, type, annee, description } = req.body;
            await Movie.create({ titre, type, annee, description });
            res.redirect('/admin/tableau-de-bord'); // Redirige vers le tableau de bord après l'ajout
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
                return res.redirect('/');
            }
            res.render('auth/login', {
                // error: req.flash('error'),
                // success: req.flash('success'),
                user: req.user
            });
        } catch (error) {
            console.error('Erreur page connexion:', error);
            res.status(500).render('errors/500');
        }
    },

    // Page d'inscription
    getRegister: (req, res) => {
        try {
            // Si l'utilisateur est déjà connecté, le rediriger vers la page d'accueil
            if (req.user) {
                return res.redirect('/');
            }
            res.render('auth/register', {
                // error: req.flash('error'),
                // success: req.flash('success'),
                user: req.user
            });
        } catch (error) {
            console.error('Erreur page inscription:', error);
            res.status(500).render('errors/500');
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
                        attributes: ['id_oeuvre', 'titre', 'type', 'annee', 'description']
                    },
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id_categorie', 'libelle']
                    },
                    {
                        model: Ingredient,
                        attributes: ['id_ingredient', 'nom_ingredient', 'unite_mesure'],
                        through: { attributes: [] } // Ignore les colonnes de la table pivot
                    },
                    {
                        model: Utensil,
                        attributes: ['id_ustensile', 'nom_ustensile'],
                        through: { attributes: [] } // Ignore les colonnes de la table pivot
                    }
                ]
            });

            if (!recipe) {
                return res.status(404).render('errors/404');
            };

            // Récupérer les recettes similaires (même catégorie)
            const similarRecipes = await Recipe.findAll({
                where: {
                    id_categorie: recipe.category.id_categorie, // Correction ici
                    id_recette: { [Op.ne]: recipe.id_recette } // Exclure la recette actuelle
                },
                include: [
                    { model: Movie },
                    { model: Category, as: 'category' }
                ],
                limit: 3
            });
            // console.log(recipe);
            // console.log(recipe.dataValues.Ingredients);
            console.log(recipe.dataValues.Utensils);

            res.render('recipes/index', {
                recipe,
                similarRecipes,
                user: req.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).render('errors/500');
        }
    },
};


function getSortingOrder(sortType) {
    const sortingOptions = {
        popular: [[literal('rating_avg'), 'DESC']],
        oldest: [['created_at', 'ASC']],
        recent: [['created_at', 'DESC']]
    };

    return sortingOptions[sortType] || sortingOptions.recent;
}


async function searchContent(query, type) {
    if (type === 'movies') {
        return Movie.findAll({
            where: {
                titre: { [Op.iLike]: `%${query}%` }
            },
            include: [{ model: Recipe }]
        });
    }

    return Recipe.findAll({
        where: {
            [Op.or]: [
                { titre: { [Op.iLike]: `%${query}%` } },
                { description: { [Op.iLike]: `%${query}%` } }
            ]
        },
        include: [
            { model: Movie },
            { model: Category, as: 'category' }
        ]
    });
}

module.exports = mainController;
