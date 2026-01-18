const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const recipeRoutes = require('./routes/recipe.route');
const adminRoutes = require('./routes/admin.route');
const cors = require('cors');


const app = express();

//middlewares
app.use(express.json());

const allowedOrigins = (process.env.CORS_ORIGINS
	? process.env.CORS_ORIGINS.split(',')
	: [
		"https://recipeebox.vercel.app",
		"http://localhost:5173",
		"http://localhost:3000",
	])
	.map((o) => String(o).trim())
	.filter(Boolean);

app.use(
	cors({
		origin: (origin, cb) => {
			// allow non-browser requests (no Origin header)
			if (!origin) return cb(null, true);
			if (allowedOrigins.includes(origin)) return cb(null, true);
			return cb(null, false);
		},
		credentials: true,
	})
);

app.use(cookieParser());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);



module.exports = app;