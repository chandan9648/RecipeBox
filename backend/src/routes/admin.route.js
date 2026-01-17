const express = require('express');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');
const { getAdminStats } = require('../controllers/admin.controller');

const router = express.Router();

// Admin-only stats (counts only, no details)
router.get('/stats', authenticate, authorizeRoles('admin'), getAdminStats);

module.exports = router;
