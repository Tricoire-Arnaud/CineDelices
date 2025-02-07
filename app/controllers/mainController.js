

  // Page de détail d'une recette
  getRecipeDetails: async (req, res) => {
    try {
      const recipeId = req.params.id;


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
