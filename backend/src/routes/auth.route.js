const express = require('express');
const { registerController, loginController, logoutController, googleLoginController } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

//AUTH ROUTES
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/google", googleLoginController);
router.post("/logout", logoutController);

// get current user
router.get('/me', authenticate, (req, res) => {
	res.json({ user: req.user });
});



module.exports = router;


