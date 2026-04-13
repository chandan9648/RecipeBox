const express = require('express');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');
const { getAdminStats, getUserRecipeStats, deleteUser, getPendingRecipes, updateRecipeStatus } = require('../controllers/admin.controller');

const router = express.Router();

// Admin-only stats)
router.get('/stats', authenticate, authorizeRoles('admin'), getAdminStats);

// Admin-only detailed stats: users + their recipe counts
router.get('/user-recipe-stats', authenticate, authorizeRoles('admin'), getUserRecipeStats);

// Admin-only user deletion
router.delete('/users/:id', authenticate, authorizeRoles('admin'), deleteUser);

// Admin-only recipe review
router.get('/recipes/pending', authenticate, authorizeRoles('admin'), getPendingRecipes);
router.patch('/recipes/:id/status', authenticate, authorizeRoles('admin'), updateRecipeStatus);

module.exports = router;
