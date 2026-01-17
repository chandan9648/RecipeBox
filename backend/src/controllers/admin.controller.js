const userModel = require('../models/auth.model');
const Recipe = require('../models/recipe.model');

async function getAdminStats(_req, res) {
  const usersCount = await userModel.countDocuments({ role: { $ne: 'admin' } });
  const recipesCount = await Recipe.countDocuments({});

  return res.json({ usersCount, recipesCount });
}

async function getUserRecipeStats(_req, res) {
  try {
    const users = await userModel.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'createdBy',
          as: 'recipes',
        },
      },
      {
        $project: {
          userId: { $toString: '$_id' },
          name: 1,
          email: 1,
          recipeCount: { $size: '$recipes' },
        },
      },
      { $sort: { recipeCount: -1, name: 1 } },
    ]);

    const totalRecipes = users.reduce((sum, u) => sum + (u.recipeCount || 0), 0);

    return res.json({ totalRecipes, users });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load user recipe stats' });
  }
}

module.exports = { getAdminStats, getUserRecipeStats };
