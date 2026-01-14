const Recipe = require('../models/recipe.model');

async function listRecipes(_req, res) {
  const recipes = await Recipe.find({}).sort({ createdAt: -1 });
  return res.json({ recipes });
}

async function getRecipeById(req, res) {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  return res.json({ recipe });
}

async function createRecipe(req, res) {
  const { title, image, desc, chef, category, ingr, inst } = req.body || {};

  if (!title || String(title).trim().length < 3) {
    return res.status(400).json({ message: 'Title is required (min 3 chars)' });
  }
  if (!desc || String(desc).trim().length < 10) {
    return res.status(400).json({ message: 'Description is required (min 10 chars)' });
  }

  const recipe = await Recipe.create({
    title: String(title).trim(),
    image: image ? String(image).trim() : '',
    desc: String(desc).trim(),
    chef: chef ? String(chef).trim() : req.user?.name || 'Anonymous',
    category: category ? String(category).toLowerCase() : '',
    ingr: ingr ? String(ingr).trim() : '',
    inst: inst ? String(inst).trim() : '',
    createdBy: req.user?._id,
  });

  return res.status(201).json({ message: 'Recipe created', recipe });
}

async function updateRecipe(req, res) {
  const { id } = req.params;
  const existing = await Recipe.findById(id);
  if (!existing) return res.status(404).json({ message: 'Recipe not found' });

  // Only creator can edit
  if (existing.createdBy && String(existing.createdBy) !== String(req.user?._id)) {
    return res.status(403).json({ message: 'You can only edit your own recipes' });
  }

  const patch = req.body || {};
  const allowed = ['title', 'image', 'desc', 'chef', 'category', 'ingr', 'inst'];
  for (const key of allowed) {
    if (patch[key] === undefined) continue;
    const val = typeof patch[key] === 'string' ? patch[key].trim() : patch[key];
    existing[key] = val;
  }

  if (existing.category) existing.category = String(existing.category).toLowerCase();

  await existing.save();
  return res.json({ message: 'Recipe updated', recipe: existing });
}

async function deleteRecipe(req, res) {
  const { id } = req.params;
  const existing = await Recipe.findById(id);
  if (!existing) return res.status(404).json({ message: 'Recipe not found' });

  if (existing.createdBy && String(existing.createdBy) !== String(req.user?._id)) {
    return res.status(403).json({ message: 'You can only delete your own recipes' });
  }

  await Recipe.deleteOne({ _id: existing._id });
  return res.json({ message: 'Recipe deleted' });
}

module.exports = {
  listRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
