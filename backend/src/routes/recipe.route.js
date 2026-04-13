const express = require('express');
const {
  listRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleLike,
  addReview,
  getMyRecipes,
} = require('../controllers/recipe.controller');
const { authenticate, authorizeRoles, optionalAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public / Mixed
router.get('/', listRecipes);
router.get('/my-recipes', authenticate, authorizeRoles('seller'), getMyRecipes);
router.get('/:id', optionalAuth, getRecipeById);

// Seller-only
router.post('/', authenticate, authorizeRoles('seller'), createRecipe);
router.patch('/:id', authenticate, authorizeRoles('seller'), updateRecipe);
router.delete('/:id', authenticate, authorizeRoles('seller'), deleteRecipe);

// User interactions
router.post('/:id/like', authenticate, toggleLike);
router.post('/:id/review', authenticate, addReview);

module.exports = router;
