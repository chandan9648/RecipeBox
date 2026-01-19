const userModel = require('../models/auth.model');
const Recipe = require('../models/recipe.model');

//ADMIN STATS CONTROLLER
async function getAdminStats(_req, res) {
  const usersCount = await userModel.countDocuments({ role: { $ne: 'admin' } });
  const recipesCount = await Recipe.countDocuments({});

  return res.json({ usersCount, recipesCount });
}

//USER RECIPE STATS CONTROLLER
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

//DELETE USER CONTROLLER
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    // Remove recipes created by this user to avoid orphan data
    await Recipe.deleteMany({ createdBy: user._id });
    await userModel.deleteOne({ _id: user._id });

    return res.json({ message: 'User deleted successfully' });
  } catch (_err) {
    return res.status(500).json({ message: 'Failed to delete user' });
  }
}

module.exports = { getAdminStats, getUserRecipeStats, deleteUser };
