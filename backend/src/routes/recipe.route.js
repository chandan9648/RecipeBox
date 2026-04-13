const express = require('express');
const {
  listRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleLike,
  addReview,
} = require('../controllers/recipe.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public
router.get('/', listRecipes);
router.get('/:id', getRecipeById);

// Seller-only
router.post('/', authenticate, authorizeRoles('seller'), createRecipe);
router.patch('/:id', authenticate, authorizeRoles('seller'), updateRecipe);
router.delete('/:id', authenticate, authorizeRoles('seller'), deleteRecipe);

// User interactions
router.post('/:id/like', authenticate, toggleLike);
router.post('/:id/review', authenticate, addReview);

module.exports = router;
