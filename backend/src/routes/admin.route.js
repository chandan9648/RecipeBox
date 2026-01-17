const express = require('express');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');
const { getAdminStats, getUserRecipeStats } = require('../controllers/admin.controller');

const router = express.Router();

// Admin-only stats (counts only, no details)
router.get('/stats', authenticate, authorizeRoles('admin'), getAdminStats);

// Admin-only detailed stats: users + their recipe counts
router.get('/user-recipe-stats', authenticate, authorizeRoles('admin'), getUserRecipeStats);

module.exports = router;
