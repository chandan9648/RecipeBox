const Recipe = require('../models/recipe.model');

//list all recipes
async function listRecipes(_req, res) {
  const recipes = await Recipe.find({}).sort({ createdAt: -1 }).populate('reviews.user', 'name avatar');
  return res.json({ recipes });
}

//get recipe by id
async function getRecipeById(req, res) {
  const { id } = req.params;
  const recipe = await Recipe.findById(id).populate('reviews.user', 'name avatar');
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  return res.json({ recipe });
}

//create recipe
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

//update recipe
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

//delete recipe
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

//toggle like
async function toggleLike(req, res) {
  const { id } = req.params;
  const userId = req.user?._id;
  
  const recipe = await Recipe.findById(id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  const isLiked = recipe.likes.includes(userId);
  if (isLiked) {
    recipe.likes.pull(userId);
  } else {
    recipe.likes.push(userId);
  }
  
  await recipe.save();
  await recipe.populate('reviews.user', 'name avatar');
  return res.json({ message: isLiked ? 'Unliked' : 'Liked', recipe });
}

//add review
async function addReview(req, res) {
  const { id } = req.params;
  const userId = req.user?._id;
  const { rating, comment } = req.body || {};

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  if (!comment || String(comment).trim().length === 0) {
    return res.status(400).json({ message: 'Comment is required' });
  }

  const recipe = await Recipe.findById(id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  // prevent multiple reviews from same user by checking
  const existingReviewIndex = recipe.reviews.findIndex(r => String(r.user) === String(userId));
  if (existingReviewIndex !== -1) {
    recipe.reviews[existingReviewIndex].rating = Number(rating);
    recipe.reviews[existingReviewIndex].comment = String(comment).trim();
    recipe.reviews[existingReviewIndex].createdAt = new Date();
  } else {
    recipe.reviews.push({
      user: userId,
      rating: Number(rating),
      comment: String(comment).trim(),
    });
  }

  await recipe.save();
  await recipe.populate('reviews.user', 'name avatar');
  return res.json({ message: 'Review added', recipe });
}

module.exports = {
  listRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleLike,
  addReview,
};
