const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const recipeRoutes = require('./routes/recipe.route');
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



module.exports = app;