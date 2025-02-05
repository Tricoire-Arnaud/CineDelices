const { Recipe, Movie, Category } = require('../models');
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
                sort = 'recent'
            } = req.query;

            const limit = 12;
            const offset = (page - 1) * limit;
            const whereClause = category ? { id_categorie: category } : {};

            const [recipes, categories] = await Promise.all([
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

            res.render('recipes/catalog', {
                recipes: recipes.rows,
                categories,
                currentPage: Number.parseInt(page),
                totalPages: Math.ceil(recipes.count / limit),
                currentCategory: category,
                currentSort: sort,
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
            // Récupérer les recettes récentes pour les films
            const movieRecipes = await Recipe.findAll({
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
           
            // Récupérer les recettes récentes pour les series
            const tvShowRecipes = await Recipe.findAll({
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

            res.render('Movie&Tvshow/movie&Tvshow', {
                movieRecipes,
                tvShowRecipes,
                user: req.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).render('errors/500');
        }
    },

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
                        attributes: ['id_film', 'titre', 'annee', 'image']
                    },
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id_categorie', 'libelle']
                    }
                ]
            });

            if (!recipe) {
                return res.status(404).render('errors/404');
            }

            // Récupérer les recettes similaires (même catégorie)
            const similarRecipes = await Recipe.findAll({
                where: {
                    id_categorie: recipe.id_categorie,
                    id_recette: { [Op.ne]: recipe.id_recette } // Exclure la recette actuelle
                },
                include: [
                    { model: Movie },
                    { model: Category, as: 'category' }
                ],
                limit: 3
            });

            res.render('recipes/show', {
                recipe,
                similarRecipes,
                user: req.user
            });
        } catch (error) {
            console.error('Erreur détail recette:', error);
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
