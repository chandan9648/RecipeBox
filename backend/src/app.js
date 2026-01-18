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
	origin: ["https://recipeebox.vercel.app", "http://localhost:5173", "http://localhost:3000/api/auth/google/callback"],
	credentials: true
}));

app.use(cookieParser());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);



module.exports = app;