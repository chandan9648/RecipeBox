const userModel = require('../models/auth.model');
const Recipe = require('../models/recipe.model');

async function getAdminStats(_req, res) {
  const usersCount = await userModel.countDocuments({ role: { $ne: 'admin' } });
  const recipesCount = await Recipe.countDocuments({});

  return res.json({ usersCount, recipesCount });
}

module.exports = { getAdminStats };
