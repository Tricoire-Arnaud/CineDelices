const { Recipe, Movie, Category } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const mainController = {
    // Page d'accueil
    getHome: async (req, res) => {
        try {
            const [featuredRecipes, latestRecipes, popularCategories] = await Promise.all([
                // Récupérer les recettes mises en avant
                Recipe.findAll({
                    include: [
                        { model: Movie },
                        { model: Category }
                    ],
                    where: { is_featured: true },
                    limit: 6
                }),

                // Récupérer les dernières recettes
                Recipe.findAll({
                    include: [
                        { model: Movie },
                        { model: Category }
                    ],
                    order: [['created_at', 'DESC']],
                    limit: 6
                }),

                // Récupérer les catégories populaires
                Category.findAll({
                    include: [{
                        model: Recipe,
                        attributes: []
                    }],
                    attributes: {
                        include: [
                            [fn('COUNT', col('Recipes.id_recette')), 'recipeCount']
                        ]
                    },
                    group: ['Category.id_categorie'],
                    order: [[literal('recipeCount'), 'DESC']],
                    limit: 4
                })
            ]);

            res.render('home/index', {
                featuredRecipes,
                latestRecipes,
                popularCategories,
                user: req.user
            });
        } catch (error) {
            console.error('Erreur page accueil:', error);
            res.status(500).render('errors/500');
        }
    },

    // Page Catalogue
    getCatalog: async (req, res) => {
        try {
            const { page = 1, category, sort = 'recent' } = req.query;
            const limit = 12;
            const offset = (page - 1) * limit;

            const whereClause = category ? { id_categorie: category } : {};
            const orderClause = getOrderClause(sort);

            const [recipes, categories] = await Promise.all([
                Recipe.findAndCountAll({
                    where: whereClause,
                    include: [
                        { model: Movie },
                        { model: Category }
                    ],
                    order: orderClause,
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

    // Page de recherche
    search: async (req, res) => {
        try {
            const { q, type } = req.query;
            const results = await getSearchResults(q, type);

            res.render('search', {
                results,
                query: q,
                type,
                user: req.user
            });
        } catch (error) {
            console.error('Erreur recherche:', error);
            res.status(500).render('errors/500');
        }
    }
};

// Fonctions utilitaires
function getOrderClause(sort) {
    switch (sort) {
        case 'popular':
            return [[literal('rating_avg'), 'DESC']];
        case 'oldest':
            return [['created_at', 'ASC']];
        default:
            return [['created_at', 'DESC']];
    }
}

async function getSearchResults(query, type) {
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
            { model: Category }
        ]
    });
}

module.exports = mainController;
