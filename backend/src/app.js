const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const recipeRoutes = require('./routes/recipe.route');
const adminRoutes = require('./routes/admin.route');
const cors = require('cors');


const app = express();

//middlewares
app.use(express.json());

app.use(cors({
	origin: ["https://recipeebox.vercel.app", "http://localhost:5173"],
	credentials: true
}));

app.use(cookieParser());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);

// Error handler (keeps API responses consistent)
app.use((err, req, res, next) => {
	console.error('Unhandled error:', err);
	const status = err?.statusCode || err?.status || 500;
	const payload = { message: err?.message || 'Internal Server Error' };
	if (process.env.NODE_ENV !== 'production') {
		payload.stack = err?.stack;
	}
	res.status(status).json(payload);
});

module.exports = app;